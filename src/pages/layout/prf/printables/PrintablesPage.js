import React, { useEffect, useRef, useState } from "react";
import PrfProvider from "../PrfProvider";
import "./prf_printable.css";
import TabComponent from "./components/TabComponent";
import { useParams } from "react-router-dom";
import { get_all_prf_summaryOfCandidContent } from "../axios/prfRequest";
import PrintableContent from "./components/PrintableContent";
import { useReactToPrint } from "react-to-print";
import { usePrfData } from "./context/PrintableDataProvider";
import CustomModal from "./components/CustomModal";

export default function PrintablesPage() {
  const { process, prf_id } = useParams();
  console.log("process", process);
  const { setPrfId, fetchPrintableContent, showModal, setProcessType } =
    usePrfData();

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = ""; // Enable scrolling
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  console.log("show prf_id", prf_id);
  useEffect(() => {
    if (prf_id) {
      console.log("useEffect prf_id", prf_id);
      setPrfId(prf_id);
      // fetchPrintableContent(prf_id);
    }
    if (process) {
      setProcessType(process);
    }
  }, [prf_id]);

  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Summary of Candidates",
  });
  return (
    <div className="prf_printable">
      <div className="prf_printable_nav">
        <TabComponent process={process} />
      </div>
      <div className="prf_printable_main">
        <div className="prf_printable_main_header">
          <button className="PRF_CustomInput_Button save_changes_bttn">
            Save Changes
          </button>
          <button className="PRF_CustomInput_Button" onClick={handlePrint}>
            PRINT
          </button>
        </div>
        <div className="prf_printable_container">
          <PrintableContent ref={printRef} process={process} />
          <CustomModal showModal={showModal} />
        </div>
      </div>
    </div>
  );
}
