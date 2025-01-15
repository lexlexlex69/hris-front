import React from "react";
import PrintableHeaderContainer from "./PrintableHeaderContainer";
import PrintableHeader from "./PrintableHeader";
import { usePrfData } from "../context/PrintableDataProvider";

function PrintableTemplate({
  children,
  designPreview,
  forDesignHeader,
  forDesignFooter,
  index,
  footerLabel,
  noHeader,
  JOSettings,
  lastPage,
  lastChunkReader,
}) {
  const { prfData } = usePrfData();
  console.log("footerLabel", footerLabel);

  return (
    <div className={`page ${noHeader && "page-landscape"}`} key={index}>
      {/* <PrintableHeaderContainer
        designPreview={designPreview}
        forDesign={forDesignHeader}
        type="header"
      /> */}
      {!noHeader && (
        <PrintableHeader
          imgUrl={forDesignHeader}
          designPreview={designPreview.header}
          type={"header"}
        />
      )}

      <div className={`page-body ${noHeader && "page-body-landscape"}`}>
        {children}
      </div>
      {noHeader && (
        <>
          <div
            style={{
              display: "flex",
              width: "100%",
              padding: "0px 20px",
              color: "#212529",
            }}
            className="fontArial"
          >
            <div className="customFont-10">CHRMO.02/AKP</div>
            <div style={{ flex: "1 1 auto" }}></div>
            <div className="customFont-10">
              Page {index} of{" "}
              {lastChunkReader
                ? JOSettings.chunkState.length + 1
                : JOSettings.chunkState.length}
            </div>
          </div>
        </>
      )}
      <div>
        {footerLabel && (
          <>
            <p style={{ fontSize: "8px", marginLeft: "80px" }}>
              PRF# {prfData && prfData.SummaryOfCandidPrfDetails.prf_no}
            </p>
            <p style={{ fontSize: "8px", marginLeft: "80px" }}>
              CHRMO.02/KJDM{" "}
            </p>
          </>
        )}

        {!noHeader && (
          <PrintableHeader
            imgUrl={forDesignFooter}
            designPreview={designPreview.footer}
            type={"footer"}
          />
        )}
      </div>
      {/* <PrintableHeaderContainer
        designPreview={designPreview}
        forDesign={forDesignFooter}
        type="footer"
      /> */}
    </div>
  );
}

export default PrintableTemplate;
