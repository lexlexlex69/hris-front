import React,{memo} from 'react';
import {TextField} from '@mui/material';

const SpecifyDetails = memo(({value,label,setValue})=>{
    return (
        <TextField label={label} value = {value} onChange = {e => setValue(e.target.value)}/>
    )
},)

export default SpecifyDetails;