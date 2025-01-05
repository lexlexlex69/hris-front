import React from "react"
import "./PrintableHeader.css"
import nophoto from "../images/nophoto.png"

function PrintableHeader({ headerURL, type, changedPreview }) {
  console.log(headerURL)
  return (
    <>
      {type === "header" ? (
        <header className="printableHeader">
          <img
            src={
              !changedPreview
                ? headerURL
                  ? `http://127.0.0.1:8000/storage/${headerURL}`
                  : nophoto
                : headerURL
            }
          />
        </header>
      ) : (
        <footer className="printableHeader">
          <img
            src={
              !changedPreview
                ? headerURL
                  ? `http://127.0.0.1:8000/storage/${headerURL}`
                  : nophoto
                : headerURL
            }
          />
        </footer>
      )}
    </>
  )
}

export default PrintableHeader
