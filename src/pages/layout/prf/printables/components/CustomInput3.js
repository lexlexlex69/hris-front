import React, { useRef, useState } from "react"
import "./CustomInput2.css"
import { usePrfData } from "../context/PrintableDataProvider"
import nophoto from "../images/nophoto.png"

function CustomInput3({ title, imgUrl, designPreview }) {
  const { headerImg, footerImg, handleImgFile, handleApplyImg } = usePrfData()
  const image_pathRef = useRef()

  const imageChanged = designPreview
  const defaultImage = imgUrl
    ? `http://127.0.0.1:8000/storage/${imgUrl}`
    : nophoto

  return (
    <div className="PRF_CustomInput">
      <div className="PRF_CustomInput_Header">{title}</div>
      <div className="PRF_CustomInput_Body2">
        <div className="PRF_CustomInput_Design_Container">
          <div className="PRF_CustomInput_Design_Image_Container printableHeader">
            <img src={imageChanged ? imageChanged : defaultImage} />
            {/* {title === "HEADER" && !headerImg && img && (
              <img
                src={img ? `http://127.0.0.1:8000/storage/${img}` : nophoto}
              />
            )}

            {title === "HEADER" && headerImg && (
              <img src={headerImg ? headerImg.preview : nophoto} />
            )}

            {title === "FOOTER" && !footerImg && img && (
              <img
                src={img ? `http://127.0.0.1:8000/storage/${img}` : nophoto}
              />
            )}

            {title === "FOOTER" && footerImg && (
              <img src={footerImg ? footerImg.preview : nophoto} />
            )} */}
          </div>

          {/* <div className="PRF_CustomInput_Design_Image_Container">
              <h3>NO IMAGE</h3>
            </div> */}

          <div className="PRF_CustomInput_Design_Input">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <input
                ref={image_pathRef}
                id="dropzone-file"
                name={title}
                type="file"
                onChange={(e) => handleImgFile(e)}
              />
              <button
                className="PRF_CustomInput_Button"
                name={title}
                onClick={handleApplyImg}
                disabled={
                  title === "HEADER"
                    ? title === "HEADER" && !headerImg
                    : title === "FOOTER" && !footerImg
                }
              >
                Apply
              </button>

              {/* <button onClick={handleImageUpload}>Edit</button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomInput3
