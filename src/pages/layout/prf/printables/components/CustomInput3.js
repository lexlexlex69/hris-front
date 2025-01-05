import React, { useRef, useState } from "react";
import "./CustomInput2.css";
import { usePrfData } from "../context/PrintableDataProvider";
import nophoto from "../images/nophoto.png";

function CustomInput3({ title, img }) {
  const { headerImg, footerImg, handleImgFile, handleApplyImg } = usePrfData();
  const image_pathRef = useRef();
  // const handleImageUpload = async () => {
  //   const imagepath = image_pathRef.current.files[0]; // Get the selected file
  //   try {
  //     if (imagepath) {
  //       const formData = new FormData();
  //       formData.append("imagepath", imagepath); // Append the file to the form data
  //       formData.append("_method", "PUT"); // Append the file to the form data
  //       await updatePhoto(formData);
  //     }

  //     await currentUser();
  //     window.location.reload(false);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  return (
    <div className="PRF_CustomInput">
      <div className="PRF_CustomInput_Header">{title}</div>
      <div className="PRF_CustomInput_Body2">
        <div className="PRF_CustomInput_Design_Container">
          <div className="PRF_CustomInput_Design_Image_Container printableHeader">
            {title === "HEADER" && !headerImg && img && (
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
            )}
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
  );
}

export default CustomInput3;
