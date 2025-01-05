import React, { useEffect, useRef, useState } from "react";
import {
    useNavigate
} from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import '../DTR.css';
import Version2 from "./Versions/Version2";
import Version1 from "./Versions/Version1";

export default function ViewEmpDTR(){
    return(
        <Version1/>
    )
}