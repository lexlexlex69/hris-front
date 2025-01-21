import React, { useRef, useState } from "react"
import "./CustomInput2.css"
import { usePrfData } from "../context/PrintableDataProvider"
import nophoto from "../images/nophoto.png"
import letterfoot from "../images/letterfoot.png"
import letterhead from "../images/letterhead.png"
import { Button, styled } from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
})

function CustomInput3({ title, imgUrl, designPreview }) {
  const { headerImg, footerImg, handleImgFile, handleApplyImg } = usePrfData()
  const image_pathRef = useRef()

  const imageChanged = designPreview
  const defaultImage = imgUrl
    ? `http://127.0.0.1:8000/storage/${imgUrl}`
    : title === "HEADER"
    ? letterhead
    : letterfoot

  return (
    <div className="PRF_CustomInput">
      <div className="PRF_CustomInput_Header">{title}</div>
      <div className="PRF_CustomInput_Body2">
        <div className="PRF_CustomInput_Design_Container">
          <div className="PRF_CustomInput_Design_Image_Container printableHeader">
            <img src={imageChanged ? imageChanged : defaultImage} />
          </div>

          <div className="PRF_CustomInput_Design_Input">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload file
                <input
                  ref={image_pathRef}
                  id="dropzone-file"
                  name={title}
                  type="file"
                  onChange={(e) => handleImgFile(e)}
                  hidden
                />
              </Button>

              <Button
                variant="contained"
                color="success"
                size="small"
                name={title}
                onClick={handleApplyImg}
                disabled={
                  title === "HEADER"
                    ? title === "HEADER" && !headerImg
                    : title === "FOOTER" && !footerImg
                }
              >
                {" "}
                Apply
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomInput3
