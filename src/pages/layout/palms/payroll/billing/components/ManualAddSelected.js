import { Button, Grid, TextField, Autocomplete } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import SmallModal from "../../../../custommodal/SmallModal";
import SearchEmpModal from "../../../../custommodal/SearchEmpModal";
import { APIWarning, formatExtName, formatMiddlename } from "../../../../customstring/CustomString";
import { Period } from "./Period";
import { getEmpBilling, postBilling } from "../BillingRequest";
import Swal from "sweetalert2";
import { APILoading } from "../../../../apiresponse/APIResponse";
export const ManualAddSelected = ({loanType,openManualAdd,setOpenManualAdd,selectedData,setSelectedData,data,setData,type,pFrom,pTo}) =>{
    const [openSearch,setOpenSearch] = useState(false);
    const [amount,setAmount] = useState('')
    const [selectedEmp,setSelectedEmp] = useState({
        fname:'',
        mname:'',
        lname:'',
        extname:'',
    });
    useEffect(()=>{
        if(selectedData){
            setSelectedEmp(selectedData)
        }
    },[selectedData])
    // const handleOpenAdd = ()=>{
    //     setSelectedEmp({
    //         fname:'',
    //         mname:'',
    //         lname:'',
    //         extname:''
    //     })
    //     setActionType(0)
    //     setOpenAdd(true)
    // }
    const [selectedLoanType,setSelectedLoanType] = useState(null);
    const updateSelect = async (row)=>{
        console.log(row)
        // let t_data = {
        //     year:moment().format('YYYY'),
        //     emp_id:row.id_no
        // }
        // const res = await getEmpBilling(t_data);
        // console.log(res.data)
        setSelectedEmp(row)
    }
    const handleSubmit = async(from,to,year)=>{
        console.log(selectedEmp)
        if(selectedLoanType && amount>0 && selectedEmp.id){
            APILoading('info','Adding billing data','Please wait')

            try{
                let t_data = {
                    period_from:from,
                    period_to:to,
                    period_year:year,
                    data:[{
                        emp_id:selectedEmp.id,
                        emp_no:selectedEmp.id_no,
                        lname:selectedEmp.lname,
                        fname:selectedEmp.fname,
                        mname:selectedEmp.mname,
                        extname:selectedEmp.extname,
                        id:selectedEmp.id_no,
                        loantype:selectedLoanType.abbr_name,
                        amount:amount,
                        loancode:selectedLoanType.loan_code,
                        loanname:selectedLoanType.loan_desc
                    }],
                    type:1
                }
                const res = await postBilling(t_data)
                if(res.data.status === 200){
                    setSelectedLoanType(null)
                    setAmount('')
                    if(type==='main'){
                        let temp = data.filter(el=>el.id === selectedEmp.id);
                        var dtl = JSON.parse(temp[0].details)
                        dtl.push(res.data.inserted_data[0])
                        // temp.details = JSON.stringify(dtl)
                        
                        for(let item of Object.keys(data)) {
                            if(data[item].id === selectedEmp.id) {
                                data[item].details = JSON.stringify(dtl)
                            }
                        }
                    }else if(type==='sub'){
                        setData(res.data.inserted_data)
                    }else{
                        let temp = data.filter(el=>el.id === selectedEmp.id);
                        var dtl = JSON.parse(temp[0].details)
                        dtl.push(res.data.inserted_data[0])
                        // temp.details = JSON.stringify(dtl)
                        
                        for(let item of Object.keys(data)) {
                            if(data[item].id === selectedEmp.id) {
                                data[item].details = JSON.stringify(dtl)
                            }
                        }
                    }
                    
                    Swal.fire({
                        icon:'success',
                        title:res.data.message,
                        showConfirmButton:false,
                        timer:1000
                    })
                }else{
                    var html = '';
                    if(res.data.no_emp_no.length>0){
                        html+='<div id="billing"><span>No employee id found. Please check the ID</span><table class="table table-bordered table-html" ><thead><tr><th>ID</th><th>Name</th></tr></thead><tbody>';
                        res.data.no_emp_no.forEach(el => {
                            html+='<tr><td>'+el.id+'</td>'+'<td>'+`${el.lname}, ${el.fname} ${formatMiddlename(el.mname)}`+'</td></tr>';
                        });
                        html+='</tbody></table></div>';
                    }
                    Swal.fire({
                        icon:'warning',
                        title:res.data.message,
                        html:html
                    })
                }

            }catch(error){
                
                Swal.fire({
                    icon:'error',
                    title:error
                })
            }
            
        }else{
            APIWarning('Oops... Please select Loantype !')
        }
        
    }
    const handleClose = ()=>{
        // setSelectedData({})
        setOpenManualAdd(false)
    }
    return (
        <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
            {/* <Button startIcon={<AddIcon/>} variant="contained" onClick={handleOpenAdd}>
                Manual Add
            </Button> */}
            <SmallModal open = {openManualAdd} close = {handleClose} title={`Add Billing to ${selectedData?.lname}, ${selectedData?.fname}`}>
            <Grid container spacing={2} sx={{p:1}}>
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
                <Grid item xs={12} sx={{display:'flex',flexDirection:'row'}}>
                    <TextField label='Employee Name' fullWidth value={`${selectedEmp?.fname} ${formatMiddlename(selectedEmp?.mname)} ${selectedEmp?.lname} ${formatExtName(selectedEmp?.extname)}`} disabled required/>
                    {/* <Button onClick={()=>setOpenSearch(true)} variant="outlined" disabled = {actionType===1?true:false}>
                    Search
                    </Button>
                    <SearchEmpModal open = {openSearch} close = {()=>setOpenSearch(false)} title='Search Employee' updateSelect = {updateSelect} type={1}>
                    </SearchEmpModal> */}
                </Grid>
                <Grid item xs={12}>
                    <TextField label='Amount' type='number' value={amount} onChange={(val)=>setAmount(val.target.value)} fullWidth required/>
                </Grid>
                <Grid item xs={12}>
                    <Period handleSubmit={handleSubmit} pFrom={pFrom} pTo = {pTo}/>
                </Grid>
            </Grid>
            </SmallModal>
        </Grid>
    );
}