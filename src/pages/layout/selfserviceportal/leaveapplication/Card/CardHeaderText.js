import { Typography } from "@mui/material"
import React from "react"
const CardHeaderText = (props,ref) => {
    return (
        <Typography sx={{color:props.color,padding:'10px',background:'#f1f1f1',fontSize:17,fontWeight:'bold',fontFamily:'latoreg'}}>{props.title}</Typography>
    )
}
export default CardHeaderText;