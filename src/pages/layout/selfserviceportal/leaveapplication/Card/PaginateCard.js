import { Box,Typography } from "@mui/material";
import React from "react"
import PaginationOutlined from "../../../custompagination/PaginationOutlined";
import { grey } from "@mui/material/colors";
const PaginateCard = (props,ref) => {
    return (
        <Box xs={12} sx={{display:'flex',justifyContent:'flex-end',mt:1,alignItems:'center'}}>
            <Typography sx={{color:grey[700],fontSize:'.7rem'}}>Page {props.page} of {Math.ceil(props.data.length/props.rowsPerPage)}</Typography>
            <PaginationOutlined count={Math.ceil(props.data.length/props.rowsPerPage)} onChange={props.handleChagePage} color='primary'/>
        </Box>
    )
}
export default PaginateCard;