import React, { useEffect, useState } from "react";
import {
    useNavigate
} from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {blue,red,orange,green} from '@mui/material/colors';
import { checkPermission } from "../../permissionrequest/permissionRequest";
import ModuleHeaderText from "../../moduleheadertext/ModuleHeaderText";
import { Box, Fade, FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import DashboardLoading from "../../loader/DashboardLoading";
import { Lapse } from "./Tables/Lapse";
import { Current } from "./Tables/Current";
import { getTrainingReports } from "./TrainingReportsRequest";
import { toast } from "react-toastify";

export const TrainingReports = () =>{
    // media query
    const navigate = useNavigate()

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoading,setIsLoading] = useState(true)

    useEffect(()=>{
        checkPermission(71)
        .then((response)=>{
            setIsLoading(false)
            if(response.data){

            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        })
    },[])
    const [typeData,setTypeData] = useState(['Current','Lapse'])
    const [selectedType,setSelectedType] = useState('')
    const [reportsData,setReportsData] = useState([])
    const handleSetType = async (e)=>{
        setSelectedType(e.target.value)
        let data = {
            type:e.target.value
        }
        const res = await getTrainingReports(data)
        console.log(res.data)
        if(res.data.length>0){
            setReportsData(res.data)
        }else{
            setReportsData(res.data)
            toast.error('No data found')
        }
    }
    const showResult = () => {
        switch(selectedType){
            case 'Current':
                return(
                    <Current data = {reportsData}/>
                )
            case 'Lapse':
                return(
                    <Lapse data = {reportsData}/>
                )

        }
    }
    return(
        <Box sx={{margin:'0 10px 10px 10px',paddingBottom:'20px'}}>
            {
                isLoading
                ?
                <DashboardLoading/>
                :
                <Fade in>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sx={{margin:'0 0 10px 0'}}>
                            <ModuleHeaderText title='Training Reports'/>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedType}
                                label="Type"
                                onChange={handleSetType}
                                >
                                {
                                    typeData.map((item,key)=>
                                        <MenuItem value = {item} key={key}>{item}</MenuItem>
                                    )
                                }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            {showResult()}
                        </Grid>
                    </Grid>
                </Fade>
        }
        </Box>
    )
}