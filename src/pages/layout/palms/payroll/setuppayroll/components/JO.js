import { Grid,Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAllOffices } from "../SetupPayrollRequests";
import FullModal from "../../../../custommodal/FullModal";
import { AddCasual } from "./Add/AddCasual";
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import MediumModal from "../../../../custommodal/MediumModal";
import { Groupings } from "./groupings/Groupings";
import { AddJO } from "./Add/AddJO";
import { PayrollDtl } from "./payrolldtl/PayrollDtl";
export const JO = ({loanType,offices,tabValue,tempDetails}) =>{
    // const [offices,setOffices] = useState([])
    const [openAdd,setOpenAdd] = useState(false)
    const [openGroupings,setOpenGroupings] = useState(false)
    // useEffect(()=>{
    //     _init();
    // },[])
    // const _init = async () =>{
    //     const res = await getAllOffices();
    //     setOffices(res.data)
    //     console.log(res.data)
    // }
    const handleAdd = () => {
        setOpenAdd(true)
    }
    const handleCloseAdd = ()=>{
        setOpenAdd(false)
    }
    const handleGroupings = () => {
        setOpenGroupings(true)
    }
    const handleCloseGroupings = ()=>{
        setOpenGroupings(false)
    }
    
    return (
        <Box>
            <PayrollDtl loanType={loanType} cat={5} empStatus = 'JO' empStatusName = 'Job Order' offices={offices} tabValue={tabValue} tempDetails={tempDetails}/>
            <Grid container spacing={1}>
                {/* <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                    <Button onClick={handleAdd} variant="contained" startIcon={<AddIcon/>}>Add</Button>
                    <Button onClick={handleGroupings} variant="contained" startIcon={<SettingsIcon/>} color="info">Groupings</Button>

                </Grid> */}

                <FullModal open = {openAdd} close = {handleCloseAdd} title='Adding Job Order Payroll'>
                    <AddJO offices = {offices}/>
                </FullModal>
                <MediumModal open = {openGroupings} close = {handleCloseGroupings} title='Job Order Payroll Groupings'>
                    <Groupings offices = {offices} emp_status = 'JO'/>
                </MediumModal>
            </Grid>
        </Box>

    )
}