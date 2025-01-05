import { Box, Grid, Tabs, Tab, Typography, IconButton, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// media query
import { blue, red, green, orange } from '@mui/material/colors'
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { toast } from "react-toastify";
import SettingsIcon from '@mui/icons-material/Settings';
import Swal from "sweetalert2";
import AddIcon from '@mui/icons-material/Add';
import { Cached as CachedIcon } from '@mui/icons-material';

// custom component
import { checkPermission } from "../../../permissionrequest/permissionRequest";
import DashboardLoading from "../../../loader/DashboardLoading";
import ModuleHeaderText from "../../../moduleheadertext/ModuleHeaderText";
import { Regular } from "./components/Regular";
import { Casual } from "./components/Casual";
import { COS } from "./components/COS";
import { addPayAllowance, getAllOffices, getFixContrib, getPayAllowance, getPayClerk, getPayGroupAPI, getPayType, getPayrollSignatories, tempPayrollAllowance } from "./SetupPayrollRequests";
import MediumModal from "../../../custommodal/MediumModal";
import { FixedContrib } from "./components/modal/FixedContrib";
import LargeModal from "../../../custommodal/LargeModal";
import { APILoading } from "../../../apiresponse/APIResponse";
import SmallModal from "../../../custommodal/SmallModal";
import { PayrollSignatories } from "./components/modal/PayrollSignatories";
import { JO } from "./components/JO";
import { Special } from "./components/Special";
import { getLoanTypes } from "../billing/BillingRequest";
import { PayrollSetup } from "./components/modal/PayrollSetup";
import { api_url } from "../../../../../request/APIRequestURL";

export const SetupPayroll = () => {
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('lg'));
    const [isLoading, setIsLoading] = useState(true)
    const [tabValue, setTabValue] = useState(0)
    const [openSig, setOpenSig] = useState(false)
    const [loanType, setLoanType] = useState([])
    const [payType, setPayType] = useState([])
    const [payClerk, setPayClerk] = useState([])
    const [payAllowance, setPayAllowance] = useState([])
    const [filterPayType, setFilterPayType] = useState([])
    const [openPaySetup, setOpenPaySetup] = useState(false)
    const [offices, setOffices] = useState([])
    const [tempDetails, setTempDetails] = useState([])
    const fetchData = async () => {
        try {
            const response = await checkPermission(80);
            if (response.data) {
                setIsLoading(false);
                const res = await getLoanTypes();
                setLoanType(res.data);

                const res2 = await getPayType();
                setPayType(res2.data.data);

                const res3 = await getPayClerk();
                setPayClerk(res3.data.data);

                const res4 = await getPayAllowance();
                setPayAllowance(res4.data.data);

                const pay_group = await getPayGroupAPI();
                console.log(pay_group);

                const res5 = await getAllOffices();
                setOffices(res5.data)

                setTempDetails({
                    payType: res2.data.data,
                    payClerk: res3.data.data,
                    payAllowance: res4.data.data
                })
            } else {
                navigate(`/${process.env.REACT_APP_HOST}`);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
    };
    const [fixedContribData, setFixedContribData] = useState([]);
    const [openFContrib, setOpenFContrib] = useState(false);
    const [signatories, setSignatories] = useState([]);
    const handleFixedContrib = async () => {
        APILoading('info', 'Loading Data', 'Please wait...')
        const empStatusMap = {
            0: ['RE', 'EL', 'CT', 'CO', 'HN', 'CN'],
            1: ['CS'],
            2: ['COS'],
            3: ['JO'],
            4: ['ALL']
        }
        const empTabVal = empStatusMap[tabValue];
        const res = await getFixContrib({ empStatus: empTabVal });
        setFixedContribData(res.data.data)
        setOpenFContrib(true)
        Swal.close();
    }
    const handleSignatories = async () => {
        APILoading('info', 'Loading Signatories', 'Please wait...')
        const res = await getPayrollSignatories();
        setSignatories(res.data.data)
        Swal.close();
        setOpenSig(true)
    }
    const handleSetupPayroll = async () => {
        let filter;
        switch (tabValue) {
            case 0:
                filter = payType.filter(el => el.tran_category == 1);
                setFilterPayType(filter)
                break;
            case 1:
                filter = payType.filter(el => el.tran_category == 2);
                setFilterPayType(filter)
                break;
            case 2:
                filter = payType.filter(el => el.tran_category == 3);
                setFilterPayType(filter)
                break;
            case 3:
                filter = payType.filter(el => el.tran_category == 5);
                setFilterPayType(filter)
                break;
            default:
                break;
        }
        setOpenPaySetup(true)
    }
    const handleReloadData = () => {
        setIsLoading(true);
        fetchData();
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
                            {/* <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                                <ModuleHeaderText title = 'Setup Payroll'/>
                        </Grid> */}
                            <Grid item xs={12}>
                                <Box sx={{ width: '100%', typography: 'body1' }}>
                                    <Box sx={{ display: 'flex', flexDirection: matches ? 'column-reverse' : 'row', gap: 1, borderBottom: 1, borderColor: 'divider', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Tabs value={tabValue} onChange={handleChangeTab} aria-label="manage evaluation tabs" variant="scrollable" scrollButtons allowScrollButtonsMobile sx={{ '.Mui-selected': { fontWeight: 'bold' } }}>
                                            <Tab label="Regular" {...a11yProps(0)} />
                                            <Tab label="Casual" {...a11yProps(1)} />
                                            <Tab label="Contract of Service" {...a11yProps(2)} />
                                            <Tab label="Job Order" {...a11yProps(3)} />
                                            <Tab label="Special" {...a11yProps(4)} />
                                        </Tabs>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <IconButton className="custom-iconbutton" color="primary" aria-label="reload table data" size="small" onClick={handleReloadData}> <CachedIcon /> </IconButton>
                                            <Button variant="outlined" color="info" startIcon={<SettingsIcon />} onClick={handleSignatories} className="custom-roundbutton">Signatories</Button>
                                            <Button variant="outlined" startIcon={<SettingsIcon />} onClick={handleFixedContrib} className="custom-roundbutton">Contributions</Button>
                                            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleSetupPayroll} className="custom-roundbutton">Payroll Setup</Button>
                                        </Box>
                                    </Box>
                                    <TabPanel value={tabValue} index={0}>
                                        <Regular loanType={loanType} offices={offices} tabValue={tabValue} tempDetails={tempDetails} />
                                    </TabPanel>
                                    <TabPanel value={tabValue} index={1}>
                                        <Casual loanType={loanType} offices={offices} tabValue={tabValue} tempDetails={tempDetails} />
                                    </TabPanel>
                                    <TabPanel value={tabValue} index={2}>
                                        <COS loanType={loanType} offices={offices} tabValue={tabValue} tempDetails={tempDetails} />
                                    </TabPanel>
                                    <TabPanel value={tabValue} index={3}>
                                        <JO loanType={loanType} offices={offices} tabValue={tabValue} tempDetails={tempDetails} />
                                    </TabPanel>
                                    <TabPanel value={tabValue} index={4}>
                                        <Special loanType={loanType} offices={offices} tabValue={tabValue} />
                                    </TabPanel>
                                </Box>
                            </Grid>
                        </Grid>
                        <LargeModal open={openFContrib} close={() => setOpenFContrib(false)} title='Fixed Contributions'>
                            <FixedContrib data={fixedContribData} updateData={setFixedContribData} close={() => setOpenFContrib(false)} offices={offices} />
                        </LargeModal>
                        <SmallModal open={openSig} close={() => setOpenSig(false)} title='Signatories'>
                            <PayrollSignatories signatories={signatories} setSignatories={setSignatories} close={() => setOpenSig(false)} />
                        </SmallModal>
                        <MediumModal open={openPaySetup} close={() => setOpenPaySetup(false)} title='Payroll Setup'>
                            <PayrollSetup tabValue={tabValue} payType={filterPayType} clerk={payClerk} payAllowance={payAllowance} close={() => setOpenPaySetup(false)} />
                        </MediumModal>
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