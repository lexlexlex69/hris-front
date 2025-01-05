import { Button, Grid, TextField, Autocomplete, Box, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import CachedIcon from '@mui/icons-material/Cached';
import SmallModal from "../../../../custommodal/SmallModal";
import SearchEmpModal from "../../../../custommodal/SearchEmpModal";
import { formatExtName, formatMiddlename } from "../../../../customstring/CustomString";
import { Period } from "./Period";
import { getEmpBilling, postBilling } from "../BillingRequest";
import Swal from "sweetalert2";
import { APILoading } from "../../../../apiresponse/APIResponse";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FullModal from "../../../../custommodal/FullModal";
import { UploadBilling } from "./UploadBilling";
import NavigationIcon from '@mui/icons-material/Navigation';
import Fab from '@mui/material/Fab';
import SettingsIcon from '@mui/icons-material/Settings';
import LargeModal from "../../../../custommodal/LargeModal";
import MediumModal from "../../../../custommodal/MediumModal";
import { UpdateBillingIDs } from "./UpdateBillingIDs";

export const ManualAdd = ({loanType,refresh}) =>{
    const [openAdd,setOpenAdd] = useState(false);
    const [openSearch,setOpenSearch] = useState(false);
    const [amount,setAmount] = useState('')
    const [actionType,setActionType] = useState(0)
    const [openUploadData,setOpenUploadData] = useState(false)
    const [openUpdateIDs,setOpenUpdateIDs] = useState(false)
    const [selectedEmp,setSelectedEmp] = useState({
        fname:'',
        mname:'',
        lname:'',
        extname:'',
    });
    const handleOpenAdd = ()=>{
        setSelectedEmp({
            fname:'',
            mname:'',
            lname:'',
            extname:''
        })
        setActionType(0)
        setOpenAdd(true)
    }
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
                    setSelectedEmp({
                        fname:'',
                        mname:'',
                        lname:'',
                        extname:'',
                    })
                    Swal.fire({
                        icon:'success',
                        title:res.data.message,
                        html
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

        }
        
    }
    const handleClose = ()=>{
        setOpenAdd(false)
    }
    return (
        <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
            <Tooltip title='Upload Billing'>
            <Fab variant="extended" color="secondary" size="medium" sx={{zIndex:1}} onClick={()=>setOpenUploadData(true)}>
                <FileUploadIcon sx={{ mr: 1 }} />
                Upload
            </Fab>
            </Tooltip>
            <Tooltip title='Add Billing'>
            <Fab variant="extended" color="primary" size="medium" sx={{zIndex:1}} onClick={handleOpenAdd}>
                <AddIcon sx={{ mr: 1 }} />
                Add
            </Fab>
            </Tooltip>

            <Tooltip title='Manage IDs'>
             <Fab variant="extended" color="info" size="medium" sx={{zIndex:1}} onClick={()=>setOpenUpdateIDs(true)}>
                <SettingsIcon sx={{ mr: 1 }} />
                Settings
            </Fab>
            </Tooltip>
            <Fab variant="extended" color="info" size="medium" sx={{zIndex:1}} onClick={refresh}>
                <CachedIcon sx={{ mr: 1 }} />
                Refresh
            </Fab>
            {/* <Button startIcon={<AddIcon/>} variant="contained" onClick={handleOpenAdd}>
                Manual Add
            </Button> */}
            {/* <Button startIcon={<FileUploadIcon/>} color="info" variant="contained" onClick={()=>setOpenUploadData(true)}>
                Upload
            </Button> */}
            {/* <Button startIcon={<CachedIcon/>} variant="contained" onClick={refresh}>
                Refresh
            </Button> */}
            <SmallModal open = {openAdd} close = {handleClose} title='Add Billing'>
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
                    <Button onClick={()=>setOpenSearch(true)} variant="outlined">
                    Search
                    </Button>
                    <SearchEmpModal open = {openSearch} close = {()=>setOpenSearch(false)} title='Search Employee' updateSelect = {updateSelect} type={1}>
                    </SearchEmpModal>
                </Grid>
                <Grid item xs={12}>
                    <TextField label='Amount' type='number' value={amount} onChange={(val)=>setAmount(val.target.value)} fullWidth required/>
                </Grid>
                <Grid item xs={12}>
                    <Period handleSubmit={handleSubmit}/>
                </Grid>
            </Grid>
            </SmallModal>
            <FullModal open = {openUploadData} close = {()=>setOpenUploadData(false)} title='Uploading File'>
                <Box sx={{maxHeight:'90vh',overflow:'auto'}}>
                <UploadBilling loanType={loanType} />
                </Box>
            </FullModal>
            <LargeModal open = {openUpdateIDs} close = {()=>setOpenUpdateIDs(false)} title='Manage Billing IDs'>
                <UpdateBillingIDs close = {()=>setOpenUpdateIDs(false)}/>
            </LargeModal>
        </Grid>
    );
}