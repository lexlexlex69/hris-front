import React,{memo} from 'react';
import {Radio,RadioGroup,FormControlLabel, Typography} from '@mui/material';

const DateType = memo(({...props})=>{
    return(
        <>
        <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            value={props.value}
            onChange={props.handleSelectDateType}
            name="radio-buttons-group"
            row
        >
            <FormControlLabel value={0} control={<Radio />} label="Whole Month" />
            <FormControlLabel value={1} control={<Radio />} label="Specific dates" />
        </RadioGroup>
        </>
    )
})

export default DateType;