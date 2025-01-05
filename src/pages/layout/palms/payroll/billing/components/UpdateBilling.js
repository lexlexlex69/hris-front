import { Grid,Autocomplete, TextField, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { updateEmpBilling } from "../BillingRequest";
import Swal from "sweetalert2";
import { APILoading } from "../../../../apiresponse/APIResponse";

export const UpdateBilling = ({mainData,selectedUpdateData,setSelectedData,loanType,close})=>{
    const [data,setData] = useState({
        amount:'',
        period_from:'',
        period_to:''
    })
    const [selectedLoanType,setSelectedLoanType] = useState(null);
    useEffect(()=>{
        setData(selectedUpdateData)
        let l_type = loanType.filter(el=>parseInt(el.loan_code) === parseInt(selectedUpdateData.loan_code));
        setSelectedLoanType(l_type[0])
    },[selectedUpdateData])
    // useEffect(()=>{
        
    // },[])
    const handleChange = (val,name)=>{
        setData({
            ...data,
            [name]:val.target.value
        })
    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
        APILoading('info','Updating info','Please wait...')
        const res = await updateEmpBilling({
            emp_no:data.emp_no,
            id:data.emp_billing_id,
            amount:data.amount,
            loantype:selectedLoanType.abbr_name,
            loancode:selectedLoanType.loan_code,
            loanname:selectedLoanType.loan_desc,
            period_from:data.period_from,
            period_to:data.period_to,
        })
        
        if(res.data.status === 200){
            // setSelectedData(JSON.stringify(res.data.data))
            for(let item of Object.keys(mainData)) {
                if(mainData[item].id === data.emp_id) {
                    mainData[item].details = JSON.stringify(res.data.data)
                    setSelectedData(mainData[item])
                    console.log(mainData[item])
                }
            }
            close();
            Swal.fire({
                icon:'success',
                title:res.data.message,
                timer:1000
            })
        }else{
            Swal.fire({
                icon:'error',
                title:res.data.message
            })
        }
    }
    return (
        <form onSubmit={handleSubmit}>
        <Grid container spacing={2} sx={{pt:1}}>
            <Grid item xs={12}>
                <Autocomplete
                    fullWidth
                    disablePortal
                    id={"combo-box-loantype"}
                    options={loanType}
                    getOptionLabel={(option) => option.loan_desc}
                    // sx={{ width: 250}}
                    value = {selectedLoanType}
                    onChange={(event, newValue) => {
                        setSelectedLoanType(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} label='Loan Type' required/>}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField label='Amount' value = {data.amount} onChange = {(val)=>handleChange(val,'amount')} type="number" fullWidth/>
            </Grid>
            <Grid item xs={6}>
                <TextField label='From' value = {data.period_from} onChange = {(val)=>handleChange(val,'period_from')} type="date" fullWidth InputLabelProps={{shrink:true}}/>
            </Grid>
            <Grid item xs={6}>
                <TextField label='To' value = {data.period_to} onChange = {(val)=>handleChange(val,'period_to')} type="date" fullWidth InputLabelProps={{shrink:true}}/>
            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                <Button variant="contained" color="success" type="submit">Save Update</Button>
                <Button variant="contained" color="error" onClick={close}>Cancel</Button>
            </Grid>
        </Grid>
        </form>
    )
}