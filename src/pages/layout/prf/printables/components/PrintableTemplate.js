import React from "react"
import PrintableHeaderContainer from "./PrintableHeaderContainer"
import PrintableHeader from "./PrintableHeader"

function PrintableTemplate({
  children,
  designPreview,
  forDesignHeader,
  forDesignFooter,
  index,
}) {
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
      <PrintableHeader
        imgUrl={forDesignFooter}
        designPreview={designPreview.footer}
        type={"footer"}
      />
      {/* <PrintableHeaderContainer
        designPreview={designPreview}
        forDesign={forDesignFooter}
        type="footer"
      /> */}
    </div>
  )
}

export default PrintableTemplate
