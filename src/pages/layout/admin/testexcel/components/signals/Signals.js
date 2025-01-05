import { Box, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

export default function Signals(){
    console.log('Signals')
    const [text,setText] = useState('')
    const [list,setList] = useState([
        {name:''},
        {name:''},
        {name:''},
    ])
    const handleName = (val,key)=>{
        var temp = [...list]
        list[key].name = val.target.value
        setList(temp)
    }
    return(
        <Box>
            <Typography>Test</Typography>
            <TextField value = {text} onChange={(val)=>setText(val.target.value)} type="number"/>
            {list.map((item,key)=>
                <TextField value = {item.name} onChange={(val)=>handleName(val,key)} type="number"/>
            )}
        </Box>
    )
}