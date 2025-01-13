import React from "react";
import PrintableHeaderContainer from "./PrintableHeaderContainer";
import PrintableHeader from "./PrintableHeader";

function PrintableTemplate({
  children,
  designPreview,
  forDesignHeader,
  forDesignFooter,
  index,
  footerLabel,
}) {
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
        {footerLabel === "en" && (
          <>
            <p>PRF# </p>
            <p>CHRMO.02/KJDM </p>
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
