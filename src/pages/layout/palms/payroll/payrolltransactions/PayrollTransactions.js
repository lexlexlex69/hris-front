import { Box, Grid, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { checkPermission } from '../../../permissionrequest/permissionRequest';
import { blue, red, green, orange } from '@mui/material/colors'
import { useNavigate } from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DashboardLoading from "../../../loader/DashboardLoading";
import { toast } from "react-toastify";
import { RegularPay } from "./components/regular/RegularPay";
import { api_url } from "../../../../../request/APIRequestURL";
import { getLoanTypes } from "../billing/BillingRequest";
import { getPaySignatories } from "./PayrollTransactionsRequests";
import { CasualPay } from "./components/casual/CasualPay";
import { COSPay } from "./components/cos/COSPay";
import { JOPay } from "./components/jo/JOPay";

export const PayrollTransactions = () => {
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoading, setIsLoading] = useState(true)
    const [tabValue, setTabValue] = useState(0)
    const [loanType, setLoanType] = useState([])
    const [signatories, setSignatorires] = useState(null)
    const [user, setUser] = useState()
    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
    };
    useEffect(() => {
        _init()
    }, [])
    const _init = async () => {
        const hasPermission = await checkPermission(83)
        if (hasPermission.data) {
            setIsLoading(false)
            await Promise.all([
                fetchLoanTypes(),
                fetchSignatories()
            ])
        } else {
            navigate(`/${process.env.REACT_APP_HOST}`)
        }
    }
    const fetchLoanTypes = async () => {
        const res = await getLoanTypes({ api_url })
        console.log(res)
        setLoanType(res.data)
    }
    const fetchSignatories = async () => {
        const res = await getPaySignatories()
        setSignatorires(res.data.data)
        setUser(res.data.user)
    }
    return (
        <React.Fragment>
            {
                isLoading
                    ?
                    <Box sx={{ margin: '5px 10px 10px 10px' }}>
                        <DashboardLoading actionButtons={1} />
                    </Box>
                    :
                    <Box sx={{ margin: '5px 10px 10px 10px' }}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Box sx={{ width: '100%', typography: 'body1' }}>
                                    <Box sx={{ display: 'flex', flexDirection: matches ? 'column' : 'row', gap: 1, borderBottom: 1, borderColor: 'divider', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Tabs value={tabValue} onChange={handleChangeTab} aria-label="manage evaluation tabs" variant="scrollable" scrollButtons allowScrollButtonsMobile sx={{ '.Mui-selected': { fontWeight: 'bold' } }}>
                                            <Tab label="Regular" {...a11yProps(0)} />
                                            <Tab label="Casual" {...a11yProps(1)} />
                                            <Tab label="Contract of Service" {...a11yProps(2)} />
                                            <Tab label="Job Order" {...a11yProps(3)} />
                                            {/* <Tab label="Special" {...a11yProps(4)} /> */}
                                        </Tabs>
                                    </Box>
                                    <TabPanel value={tabValue} index={0}>
                                        <RegularPay loanType={loanType} signatories={signatories} user={user} />
                                    </TabPanel>
                                    <TabPanel value={tabValue} index={1}>
                                        <CasualPay loanType={loanType} signatories={signatories} user={user} />
                                    </TabPanel>
                                    <TabPanel value={tabValue} index={2}>
                                        <COSPay loanType={loanType} signatories={signatories} user={user} />
                                    </TabPanel>
                                    <TabPanel value={tabValue} index={3}>
                                        <JOPay loanType={loanType} signatories={signatories} user={user} />
                                    </TabPanel>
                                    {/* <TabPanel value={tabValue} index={4}>
                                    </TabPanel> */}
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
            }
        </React.Fragment>
    )
}
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}