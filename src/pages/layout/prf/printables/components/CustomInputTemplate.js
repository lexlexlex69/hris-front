import React from "react";

function CustomInputTemplate({ title, children }) {
  return (
    <div className="PRF_CustomInput">
      <div className="PRF_CustomInput_Header">{title}</div>
      <div className="PRF_CustomInput_Body">{children}</div>
    </div>
  );
}

export default CustomInputTemplate;
