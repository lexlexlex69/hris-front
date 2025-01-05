import { Grid, Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAllOffices } from "../SetupPayrollRequests";
import FullModal from "../../../../custommodal/FullModal";
import { AddRegular } from "./Add/AddRegular";
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import MediumModal from "../../../../custommodal/MediumModal";
import { Groupings } from "./groupings/Groupings";
import { AddSpecial } from "./Add/AddSpecial";
import { getEmpStatus } from "../../../../admin/userrole/Request";
export const Special = ({offices,tabValue}) => {
    // const [offices, setOffices] = useState([])
    const [openAdd, setOpenAdd] = useState(false)
    const [openGroupings, setOpenGroupings] = useState(false)
    const [empStatus, setEmpStatus] = useState([])
    useEffect(() => {
        _init();
    }, [])
    const _init = async () => {
        // const res = await getAllOffices();
        const res2 = await getEmpStatus();
        // setOffices(res.data)
        // console.log(res.data)
        setEmpStatus(res2.data)
    }
    const handleAdd = () => {
        setOpenAdd(true)
    }
    const handleCloseAdd = () => {
        setOpenAdd(false)
    }
    const handleGroupings = () => {
        setOpenGroupings(true)
    }
    const handleCloseGroupings = () => {
        setOpenGroupings(false)
    }

    return (
        <Box>
            <Grid container spacing={1}>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button onClick={handleAdd} variant="contained" startIcon={<AddIcon />}>Add</Button>
                    <Button onClick={handleGroupings} variant="contained" color='info' startIcon={<SettingsIcon />}>Groupings</Button>
                </Grid>
                <FullModal open={openAdd} close={handleCloseAdd} title='Adding Special Payroll'>
                    <AddSpecial offices={offices} empStatus={empStatus} />
                </FullModal>
                {/* <MediumModal open = {openGroupings} close = {handleCloseGroupings} title='Regular Payroll Groupings'>
                    <Groupings offices = {offices} emp_status = 'RE'/>
                </MediumModal> */}
            </Grid>
        </Box>

    )
}