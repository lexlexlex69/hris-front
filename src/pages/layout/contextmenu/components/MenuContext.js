import React, { useState, useEffect } from "react";
const MenuContext = () => {
  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        console.log("Right Click");
      }}
    >
      MenuContext
    </div>
  );
};
export default MenuContext;