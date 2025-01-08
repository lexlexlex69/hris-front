import React, { forwardRef, useEffect, useState } from "react";
import PrintableHeader from "./PrintableHeader";
import SummaryOfCandidBody1 from "./SummaryOfCandidBody1";
import { capitalizeWords } from "../Utils";
import { usePrfData } from "../context/PrintableDataProvider";
import PrintableHeaderContainer from "./PrintableHeaderContainer";
import { toWords } from "number-to-words";
import { phpPesoIntFormater } from "../../components/export_components/ExportComp";
import moment from "moment";
import { formatName } from "../../../customstring/CustomString";
import PrintableTemplate from "./PrintableTemplate";
import PrintableSummaryOfCandid from "./PrintableSummaryOfCandid";
import PrintableEn from "./PrintableEn";
import PrintableNoe from "./PrintableNoe";
import PrintableAtr from "./PrintableAtr";

export function arrayDisplay(array) {
  return array.map((item, index) => (
    <React.Fragment key={index}>
      {item}
      {array.length > 1 && !(array.length - 1 === index) && `, `}
    </React.Fragment>
  ));
}

const PrintableContent = forwardRef((props, ref) => {
  const {
    chunkState,
    prfData,
    parsedData,
    forDesignHeader,
    forDesignFooter,
    designPreview,
  } = usePrfData();
  console.log("chunkState", chunkState);
  console.log("designPreview", designPreview);

  console.log("props.process", props.process);
  return (
    <>
      <div className="prf_printable_content" ref={ref}>
        {props.process === "summaryofcandid" && <PrintableSummaryOfCandid />}
        {props.process === "en" && <PrintableEn />}
        {props.process === "noe" && <PrintableNoe />}
        {props.process === "atr" && <PrintableAtr />}
        {props.process === "jo" && <PrintableAtr />}
      </div>
    </>
  );
});

export default PrintableContent;
