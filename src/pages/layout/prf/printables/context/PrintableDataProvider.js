import { createContext, useContext, useEffect, useState } from "react";
import {
  get_all_prf_summaryOfCandidContent,
  saveDesign,
  saveEssentials,
  searchEmployee,
  updateSalaryValue,
} from "../../axios/prfRequest";
import {
  addJobDescription,
  addJobTerms,
  getEquivalentSGValue,
  getPrfSignatories,
  setSelectedRaterAssessment,
} from "../../documentpreparation/DocRequest";
import { fakeApplicant } from "./TestFakeData";

const StateContext = createContext();

export const PrfContextProvider = ({ children }) => {
  const [prfData, setPrfData] = useState(null);
  const [prf_id, setPrfId] = useState();
  const [processType, setProcessType] = useState();
  const [parsedData, setParsedData] = useState({
    educ: [],
    train: [],
    expe: [],
    elig: [],
  });
  const [chunkState, setChunkState] = useState();
  const [headerImg, setHeaderImg] = useState();
  const [footerImg, setFooterImg] = useState();
  const [designPreview, setDesignPreview] = useState({
    header: null,
    footer: null,
  });
  const [showModal, setShowModal] = useState(false);

  const [modalTitle, setModalTitle] = useState();

  const [toastOpen, setToastOpen] = useState(false);

  const [footerTitle, setFooterTitle] = useState("");

  const handleToastClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setToastOpen(false);
  };

  const handleViewClick = (title) => {
    // console.log("date", date);
    // setSelectedDate(date);
    // setModalData(groupedData[date]);
    setShowModal(true);
    setModalTitle(title);
    // let data = fakeResponse;
    // setModalData(data);
    // modalDataSetter(date);
    // console.log("modalData", modalData);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalTitle(null);
    // setModalData([]);
    // setIsAllLogsVisible(false);
    // setModalShowFilter("all");
  };

  const fetchPrintableContent = async (prf_id_payload, mount) => {
    try {
      console.log(prf_id);
      let response1 = await get_all_prf_summaryOfCandidContent({
        prf_id: prf_id_payload,
        processType,
      });
      if (mount) {
        // Only update state if the component is still mounted
        // let response2 = ;

        // console.log("response2", response2);
        if (processType === "summaryofcandid") {
          console.log("summaryprf", response1.data);
          setPrfData({
            ...response1.data,
            essentials: {
              endorsed_by: response1.data.essentials
                ? response1.data.essentials.endorsed_by
                : "EDIT THIS",
              endorsed_by_department: response1.data.essentials
                ? response1.data.essentials.endorsed_by_department
                : "EDIT THIS",
              endorsed_by_position: response1.data.essentials
                ? response1.data.essentials.endorsed_by_position
                : "EDIT THIS",
              prepared_by: response1.data.essentials
                ? response1.data.essentials.prepared_by
                : "EDIT THIS",
              prepared_by_position: response1.data.essentials
                ? response1.data.essentials.prepared_by_position
                : "EDIT THIS",
            },
          });
        } else if (processType !== "summaryofcandid") {
          console.log("nonsummaryprf", response1.data);
          setPrfData({
            SummaryOfCandidApplicantDetails:
              response1.data.SummaryOfCandidApplicantDetails.filter(
                (finding) => finding.remark === "SELECTED"
              ),
            SummaryOfCandidPrfDetails: response1.data.SummaryOfCandidPrfDetails,
            // SummaryOfCandidPrfDetails: {
            //   ...response1.data.SummaryOfCandidPrfDetails,
            //   job_desc: JSON.parse(
            //     response1.data.SummaryOfCandidPrfDetails.job_desc
            //   ),
            //   terms_condi: JSON.parse(
            //     response1.data.SummaryOfCandidPrfDetails.terms_condi
            //   ),
            // },
            footer: response1.data.footer,
            header: response1.data.header,
            address: [],
          });
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchEmpNoticeData = async (pay_sal) => {
    if (processType !== "jo") {
      try {
        console.log(prf_id);
        const response1 = await getEquivalentSGValue({ sg: pay_sal });
        const response2 = await getPrfSignatories({
          prfData: prfData.SummaryOfCandidPrfDetails,
        });

        console.log("pay_sal", response1);
        console.log("signa", response2);
        setPrfData((prev) => ({
          ...prev,
          sgData: response1.data,
          signatory: response2.data,
        }));
        // Only update state if the component is still mounted
        // setPrfData(response1.data);

        console.log("response1", response1.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const rowPageLimit = (arr) => {
    // return prfData && prfData?.SummaryOfCandidPrfDetails?.job_desc;
    const listMax = 30;
    const listLength = prfData && JSON.parse(arr).length;
    const result = Math.floor(listMax / listLength);
    return result;
  };

  const fetchJoData = async () => {
    console.log("jojojo");
    if (processType === "jo") {
      try {
        console.log(prf_id);
        const response2 = await getPrfSignatories({
          prfData: prfData.SummaryOfCandidPrfDetails,
        });

        console.log("signa", response2);
        setPrfData((prev) => ({
          ...prev,
          signatory: response2.data,
        }));
        // Only update state if the component is still mounted
        // setPrfData(response1.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

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
  // const filterSelectedApplicant = () => {
  //   setPrfData((prev) => ({
  //     ...prev,
  //     SummaryOfCandidApplicantDetails:
  //       prev.SummaryOfCandidApplicantDetails.filter(
  //         (finding) => finding.remark === "SELECTED"
  //       ),
  //   }));
  // };

  useEffect(() => {
    console.log(prf_id);
    console.log("prfData", prfData);
    console.log(parsedData);
  }, [prf_id, prfData, parsedData]);

  useEffect(() => {
    let isMounted = true; // flag to track the component mount status

    console.log(prf_id);
    console.log("prfData", prfData);

    if (processType === "summaryofcandid") {
      console.log("summ");
      !prfData && prf_id && fetchPrintableContent(prf_id, isMounted);

      // Cleanup function to set isMounted to false when the component is unmounted
      const parseArrays = () => {
        const parsedArray1 = JSON.parse(
          prfData.SummaryOfCandidPrfDetails.qs_educ_categories
        );
        const parsedArray2 = JSON.parse(
          prfData.SummaryOfCandidPrfDetails.qs_train_categories
        );
        const parsedArray3 = JSON.parse(
          prfData.SummaryOfCandidPrfDetails.qs_expe_categories
        );
        const parsedArray4 = JSON.parse(
          prfData.SummaryOfCandidPrfDetails.qs_elig_categories
        );

        // Use setParsedData to update the state
        setParsedData((prevState) => ({
          ...prevState, // Spread the previous state to retain existing values
          educ: parsedArray1,
          train: parsedArray2,
          expe: parsedArray3,
          elig: parsedArray4,
        }));
      };

      prfData && parseArrays();

      const finalData =
        prfData &&
        prfData.SummaryOfCandidApplicantDetails.map((item) => {
          const assessment = prfData.SummaryOfCandidFindings.filter(
            (finding) => item.app_id === finding.app_id
          );
          const recom = prfData.SummaryOfCandidFindings.find(
            (rec) =>
              rec.rater_remark === "selected" && rec.app_id === item.app_id
          );
          return {
            item,
            assessment,
            recom,
          };
        });

      console.log("finalData", finalData);

      const chunks = finalData && chunkArray(finalData, 2, 3);
      chunks && setChunkState(chunks);
      console.log("chunks", chunks);
    } else if (processType === "jo") {
      console.log("jojo");
      // console.log(prfData.signatory);
      !prfData && prf_id && fetchPrintableContent(prf_id, isMounted);
      console.log(prfData);
      // prfData &&
      //   setPrfData((prev) => ({
      //     ...prev,
      //     SummaryOfCandidPrfDetails: {
      //       ...prev.SummaryOfCandidPrfDetails,
      //       job_desc: JSON.parse(prev.SummaryOfCandidPrfDetails.job_desc),
      //       terms_condi: JSON.parse(prev.SummaryOfCandidPrfDetails.terms_condi),
      //     },
      //   }))
      prfData && !prfData.signatory && fetchJoData();
      // const chunks =
      //   prfData && chunkArray(prfData.SummaryOfCandidApplicantDetails, 1, 2);

      // console.log("rowPageLimit", rowPageLimit());
      const chunks =
        prfData &&
        chunkArray(
          fakeApplicant,
          rowPageLimit(prfData?.SummaryOfCandidPrfDetails?.job_desc) - 1,
          rowPageLimit(prfData?.SummaryOfCandidPrfDetails?.job_desc)
        );
      chunks && setChunkState(chunks);
      console.log(chunks);
    } else if (
      processType === "noe" ||
      processType === "en" ||
      processType === "atr"
    ) {
      console.log("nojo");
      !prfData && prf_id && fetchPrintableContent(prf_id, isMounted);
      // prfData && filterSelectedApplicant();
      prfData &&
        !prfData.sgData &&
        fetchEmpNoticeData(prfData.SummaryOfCandidPrfDetails.pay_sal);

      // Cleanup function to set isMounted to false when the component is unmounted
    }

    return () => {
      isMounted = false;
    };
  }, [prf_id, processType, prfData]);

  const forRecommendedBy =
    processType === "summaryofcandid" &&
    prfData &&
    prfData.SummaryOfCandidFindings.reduce((acc, curr) => {
      const existing = acc.find(
        (item) => item.rater_emp_id === curr.rater_emp_id
      );
      if (!existing) {
        acc.push(curr);
      }
      // console.log("curr", curr);
      return acc;
    }, []);

  const forDesignHeader = prfData
    ? prfData.header && prfData.header.image_path
    : "";
  const forDesignFooter = prfData
    ? prfData.footer && prfData.footer.image_path
    : "";

  const recommendedByChange = (e) => {
    console.log("recommendedByChange", e.target.value);
    try {
      setPrfData((prev) => ({
        ...prev,
        SummaryOfCandidFindings: [
          ...prev.SummaryOfCandidFindings.map((item) =>
            item.rater_emp_id == e.target.value
              ? { ...item, rater_remark: "selected" }
              : { ...item, rater_remark: null }
          ),
        ],
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleImgFile = (e) => {
    const selectedFile = e.target.files[0];
    if (e.target.name === "HEADER") {
      setHeaderImg({
        data: selectedFile,
        preview: URL.createObjectURL(selectedFile),
      });
    } else if (e.target.name === "FOOTER") {
      setFooterImg({
        data: selectedFile,
        preview: URL.createObjectURL(selectedFile),
      });
    }
  };

  const handleApplyImg = (e) => {
    e.preventDefault();
    if (!headerImg && !footerImg) {
      console.log("empty");
      return;
    }
    if (e.target.name === "HEADER") {
      setDesignPreview((prevDetails) => ({
        ...prevDetails,
        header: headerImg.preview,
      }));
    } else if (e.target.name === "FOOTER") {
      setDesignPreview((prevDetails) => ({
        ...prevDetails,
        footer: footerImg.preview,
      }));
    }
  };
  //try wala async hahahah
  const saveAllchanges = async (payload) => {
    console.log("saveallchange", payload.prf_id, payload.file_name);
    const recommendedById =
      processType === "summaryofcandid" &&
      prfData.SummaryOfCandidFindings.find(
        (item) => item.rater_remark === "selected"
      );
    // console.log("saveallRater_id", recommendedById.rater_emp_id);

    const sgValue = prfData.SummaryOfCandidPrfDetails.sal_value;
    const prf_id = payload.prf_id;
    const file_name = payload.file_name;

    let headerRequest = null;
    let footerRequest = null;
    let essentialsRequest = null;
    let recomByRequest = null;
    let salaryRequest = null;
    let descRequest = null;
    let termRequest = null;

    //header save
    if (headerImg?.data) {
      const formData = new FormData();
      formData.append("prf_id", prf_id);
      formData.append("file_name", file_name);
      formData.append("position", "header");
      formData.append("image_path", headerImg.data);
      headerRequest = saveDesign(formData);
    }

    //footer save
    if (footerImg?.data) {
      const formData2 = new FormData();
      formData2.append("prf_id", prf_id);
      formData2.append("file_name", file_name);
      formData2.append("position", "footer");
      formData2.append("image_path", footerImg.data);
      footerRequest = saveDesign(formData2);
    }

    //essentials save
    if (processType === "summaryofcandid") {
      const formData3 = new FormData();
      formData3.append("prf_id", prf_id);
      formData3.append("endorsed_by", prfData.essentials.endorsed_by);
      formData3.append(
        "endorsed_by_position",
        prfData.essentials.endorsed_by_position
      );
      formData3.append(
        "endorsed_by_department",
        prfData.essentials.endorsed_by_department
      );
      formData3.append("prepared_by", prfData.essentials.prepared_by);
      formData3.append(
        "prepared_by_position",
        prfData.essentials.prepared_by_position
      );
      essentialsRequest = saveEssentials(formData3);

      //recommended by save
      recomByRequest = setSelectedRaterAssessment({
        prf_id,
        selected_rater: { empID: recommendedById.rater_emp_id },
      });
    }

    //salary save
    const salaryExclusive = ["en", "noe", "atr"];
    if (salaryExclusive.includes(processType)) {
      salaryRequest = updateSalaryValue({ prf_id, sgValue });
    }

    //jo terms & desc save
    if (processType === "jo") {
      console.log({
        prfData: { id: prf_id },
        description: prfData.SummaryOfCandidPrfDetails.terms_condi,
      });
      descRequest = addJobDescription({
        prfData: { id: prf_id },
        description: JSON.parse(prfData.SummaryOfCandidPrfDetails.job_desc),
      });
      termRequest = addJobTerms({
        prfData: { id: prf_id },
        terms: JSON.parse(prfData.SummaryOfCandidPrfDetails.terms_condi),
      });
    }

    try {
      const [r1, r2, r3, r4, r5, r6, r7] = await Promise.all([
        headerRequest && headerRequest,
        footerRequest && footerRequest,
        essentialsRequest && essentialsRequest,
        recomByRequest && recomByRequest,
        salaryRequest && salaryRequest,
        descRequest && descRequest,
        termRequest && termRequest,
      ]);
      console.log(r1, r2, r3, r4, r5, r6, r7);
      setToastOpen(true);
    } catch (error) {
      console.log("error for save changes: header", error);
    }
  };

  const [employeeList, setEmployeeList] = useState();
  const fetchEmployeeByName = async (name) => {
    if (name.trim() === "") return;
    try {
      // console.log(prf_id)
      const response1 = await searchEmployee({
        data: name,
      });

      // Only update state if the component is still mounted
      setEmployeeList(response1.data);

      console.log("employeeList", response1.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleModalRowClick = (data, title) => {
    console.log("modalRowClick", data);
    if (title && title === "ENDORSED BY") {
      setPrfData((prevDetails) => ({
        ...prevDetails,
        essentials: {
          ...prevDetails.essentials,
          endorsed_by: data.endorsed_by,
          endorsed_by_position: data.endorsed_by_position,
          endorsed_by_department: data.endorsed_by_department,
        },
      }));
    } else if (title && title === "PREPARED BY") {
      setPrfData((prevDetails) => ({
        ...prevDetails,
        essentials: {
          ...prevDetails.essentials,
          prepared_by: data.prepared_by,
          prepared_by_position: data.prepared_by_position,
        },
      }));
    } else if (title && title === "Report To") {
      setPrfData((prevDetails) => ({
        ...prevDetails,
        signatory: {
          ...prevDetails.signatory,
          dept_head: {
            ...prevDetails.signatory.dept_head,
            assigned_by: data.assigned_by,
            position: data.position,
          },
        },
      }));
    }
  };
  return (
    <StateContext.Provider
      value={{
        setPrfId,
        prfData,
        setProcessType,
        setPrfData,
        chunkState,
        parsedData,
        forRecommendedBy,
        recommendedByChange,
        forDesignHeader,
        forDesignFooter,
        headerImg,
        footerImg,
        handleImgFile,
        designPreview,
        handleApplyImg,
        showModal,
        handleViewClick,
        closeModal,
        modalTitle,
        fetchEmployeeByName,
        employeeList,
        handleModalRowClick,
        saveAllchanges,
        toastOpen,
        setToastOpen,
        handleToastClose,
        footerTitle,
        setFooterTitle,
        rowPageLimit,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
export const usePrfData = () => useContext(StateContext);
