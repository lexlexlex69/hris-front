import React from "react";
import PrintableHeaderContainer from "./PrintableHeaderContainer";

function PrintableTemplate({
  children,
  designPreview,
  forDesignHeader,
  forDesignFooter,
  index,
}) {
  return (
    <div className="page" key={index}>
      <PrintableHeaderContainer
        designPreview={designPreview}
        forDesign={forDesignHeader}
        type="header"
      />

      <div className="page-body">{children}</div>
      <PrintableHeaderContainer
        designPreview={designPreview}
        forDesign={forDesignFooter}
        type="footer"
      />
    </div>
  );
}

export default PrintableTemplate;
