import { TextField } from "@mui/material";
import React from "react";

export default function SummarySlot(props){
    
    return (
        <React.Fragment>
            <TextField type="number" disabled = {props.selected === 0 ? true:false}/>
        
        </React.Fragment>
    )
}