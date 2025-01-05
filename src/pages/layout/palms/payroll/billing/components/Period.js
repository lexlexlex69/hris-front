import { Grid,TextField,Button } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";

export const Period = ({handleSubmit,pFrom,pTo})=>{
    const [periodFrom,setPeriodFrom] = useState('');
    const [periodTo,setPeriodTo] = useState('');
    const [periodYear,setPeriodYear] = useState(moment().format('YYYY'));
    useEffect(()=>{
        if(pFrom){
            setPeriodFrom(pFrom)
        }
        if(pTo){
            setPeriodTo(pTo)
        }
    },[pFrom,pTo])
    const submit = (e) =>{
        e.preventDefault();
        handleSubmit(periodFrom,periodTo,periodYear)
    }
    return (
        <form onSubmit={submit} style={{width:'100%'}}>
            <Grid item xs={12} sx={{mt:2,display:'flex',gap:1,justifyContent:'center',alignItems:'center'}}>
                <TextField type='date' label='Period From' InputLabelProps={{shrink:true}} value={periodFrom} onChange = {(val)=>setPeriodFrom(val.target.value)} required/>
                <TextField type='date' label='Period To' InputLabelProps={{shrink:true}} value={periodTo} onChange = {(val)=>setPeriodTo(val.target.value)} required/>
                <TextField type='text' label='Year' InputLabelProps={{shrink:true}} value={periodYear} onChange = {(val)=>setPeriodYear(val.target.value)} required/>
                <Button variant="contained" type="submit" sx={{height:'100%'}} size="large">Submit</Button>
            </Grid>
        </form>
    )
}