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
}) {
  const { prfData } = usePrfData();
  console.log("footerLabel", footerLabel);

  return (
    <div className="page" key={index}>
      {/* <PrintableHeaderContainer
        designPreview={designPreview}
        forDesign={forDesignHeader}
        type="header"
      /> */}
      <PrintableHeader
        imgUrl={forDesignHeader}
        designPreview={designPreview.header}
        type={"header"}
      />

      <div className="page-body">{children}</div>
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

        <PrintableHeader
          imgUrl={forDesignFooter}
          designPreview={designPreview.footer}
          type={"footer"}
        />
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
