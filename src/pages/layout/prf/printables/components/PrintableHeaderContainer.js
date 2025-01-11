import React from "react"
import PrintableHeader from "./PrintableHeader"

function PrintableHeaderContainer({ designPreview, forDesign, type }) {
  console.log("designPreview", designPreview)
  return (
    <>
      <PrintableHeader />
      {/* {(designPreview.header !== null || designPreview.footer !== null) && (
        <PrintableHeader
          headerURL={
            type === "header"
              ? designPreview && designPreview.header
              : designPreview && designPreview.footer
          }
          type={type}
          changedPreview={true}
        />
      )} */}

      {/* {designPreview.header === null &&
        designPreview.footer === null &&
        forDesign && <PrintableHeader headerURL={forDesign} type={type} />} */}
    </>
  )
}

export default PrintableHeaderContainer
