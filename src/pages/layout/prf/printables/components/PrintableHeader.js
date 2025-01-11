import React from "react"
import "./PrintableHeader.css"
import nophoto from "../images/nophoto.png"
import letterfoot from "../images/letterfoot.png"
import letterhead from "../images/letterhead.png"
import { usePrfData } from "../context/PrintableDataProvider"

function PrintableHeader({ imgUrl, designPreview, type }) {
  const imageChanged = designPreview
  const defaultImage = imgUrl
    ? `http://127.0.0.1:8000/storage/${imgUrl}`
    : type === "header"
    ? letterhead
    : letterfoot
  console.log(imgUrl)
  return (
    <>
      <div className="printableHeader">
        <img src={imageChanged ? imageChanged : defaultImage} />
      </div>
      {/* <div className="printableHeader">
        <img
          src={
            !changedPreview
              ? headerURL
                ? `http://127.0.0.1:8000/storage/${headerURL}`
                : nophoto
              : headerURL
          }
        />
      </div> */}
    </>
  )
}

export default PrintableHeader
