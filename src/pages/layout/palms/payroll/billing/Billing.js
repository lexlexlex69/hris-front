import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect,useState } from "react";

import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { PagIbig } from "./components/PagIbig";
import {blue,red,green,orange} from '@mui/material/colors'
import {useNavigate}from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { toast } from "react-toastify";
import { checkPermission } from "../../../permissionrequest/permissionRequest";
import DashboardLoading from "../../../loader/DashboardLoading";
import ModuleHeaderText from "../../../moduleheadertext/ModuleHeaderText";
import { getLoanTypes } from "./BillingRequest";
import { UploadBilling } from "./components/UploadBilling";
import moment from "moment";
import { BillingData } from "./components/BillingData";
import Fab from '@mui/material/Fab';
import NavigationIcon from '@mui/icons-material/Navigation';
import { api_url } from "../../../../../request/APIRequestURL";

export const Billing = () =>{
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoading,setIsLoading] = useState(true)
    const [value, setValue] = React.useState('1');
    const [loanType,setLoanType] = useState([])
    const [year,setYear] = useState(moment().format('YYYY'))
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    useEffect(()=>{
        checkPermission(77)
        .then((response)=>{
            if(response.data){
                _init();
                setIsLoading(false)
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        }).catch((error)=>{
            toast.error(error.message)
            console.log(error)
        })
       
    },[])
    const _init = async () => {
        // let t_data = {
        //     api_url:api_url
        // }
        const res = await getLoanTypes();
        // console.log(res)
        setLoanType(res.data)
        // setLoanType(tempLoanTypes())
        // const res = await getBillingData({year:year});
        // console.log(res.data.result)
    }
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
                                <ModuleHeaderText title = 'Billing'/>
                        </Grid>
                        <BillingData loanType = {loanType}/>
                        {/* <Grid item xs={12}>
                            <TabContext value={value}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
                                    <Tab label="GSIS" value="1" />
                                    <Tab label="PAG-IBIG" value="2" />
                                    <Tab label="DBP Loans" value="3" />
                                </TabList>
                                </Box>
                                <TabPanel value="1">GSIS</TabPanel>
                                <TabPanel value="2"><PagIbig title='Pag-Ibig' loanType={loanType}/></TabPanel>
                                <TabPanel value="3">Item Three</TabPanel>
                            </TabContext>
                        </Grid> */}
                        {/* <Grid item xs={12}>
                            <UploadBilling loanType={loanType}/>
                        </Grid> */}
                    </Grid>
                </Box>
        }
        </React.Fragment>
    )
}