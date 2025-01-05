import { Box, Grid } from "@mui/material";
import React, { useEffect,useState } from "react";
import { checkPermission } from '../../permissionrequest/permissionRequest';
import {blue,red,green,orange} from '@mui/material/colors'
import {useNavigate}from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DashboardLoading from "../../loader/DashboardLoading";
import ModuleHeaderText from "../../moduleheadertext/ModuleHeaderText";
import { toast } from "react-toastify";

export const IndividualDevPlan = () =>{
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoading,setIsLoading] = useState(true)
    useEffect(()=>{
        checkPermission(74)
        .then((response)=>{
            if(response.data){
                
                setIsLoading(false)
                
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        }).catch((error)=>{
            toast.error(error.message)
            console.log(error)
        })
       
    },[])
    return (
        <React.Fragment>
        {
                isLoading
                ?
                <Box sx={{margin:'5px 10px 10px 10px'}}>
                <DashboardLoading actionButtons={1}/>
                </Box>
                :
                <Box sx={{margin:'5px 10px 10px 10px'}}>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                                <ModuleHeaderText title = 'Individual Development Plan'/>
                        </Grid>
                    </Grid>
                </Box>
        }
        </React.Fragment>
    )
}