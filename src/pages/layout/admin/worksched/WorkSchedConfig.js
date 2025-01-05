import { Box, Button, Fab, Grid, Paper, Tab, Table, TableBody, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
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
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CachedIcon from '@mui/icons-material/Cached';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import SmallModal from "../../custommodal/SmallModal";
import { AddWorkSchedUser } from "./components/modal/AddWorkSchedUser";
import { deleteApprover, deleteEncoder, getEncoderApprover } from "./WorkSchedConfigRequests";
import { APIError, APISuccess, StyledTableCell, formatName } from "../../customstring/CustomString";
import Swal from "sweetalert2";
import { APILoading } from "../../apiresponse/APIResponse";
import { UpdateWorkSchedUser } from "./components/modal/UpdateWorkSchedUser";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Encoder } from "./components/tabs/Encoder";
import { Approver } from "./components/tabs/Approver";
export const WorkSchedConfig = () =>{
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoading,setIsLoading] = useState(true)
    const [openAdd,setOpenAdd] = useState(false)
    const [encoder,setEncoder] = useState([])
    const [approver,setApprover] = useState([])
    const [selectedUpdate,setSelectedUpdate] = useState([])
    const [openUpdate,setOpenUpdate] = useState(false)
    const [selectedType,setSelectedType] = useState('')
    useEffect(()=>{
        checkPermission(82)
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
    const _init = async () =>{
        //get encoder and approver
        const res = await getEncoderApprover()
        setEncoder(res.data.encoder)
        setApprover(res.data.approver)
        Swal.close();
    }
    
    
    const handleRefresh = ()=>{
        APILoading('info','Refreshing data','Please wait...');
        _init();
    }
    const handleUpdateData = (item,type,e)=>{
        setSelectedType(type)
        setSelectedUpdate(item)
        setOpenUpdate(true)
        handleClose(item.id,e)
    }
    const [anchorEl, setAnchorEl] = useState([]);
    const [anchorEl2, setAnchorEl2] = useState([]);

    const handleClick = (id,event) => {
        let temp = [...anchorEl];
        temp[id] = event.currentTarget
        setAnchorEl(temp);
    };
    const handleClose = (id,event) => {
        let temp = [...anchorEl];
        temp[id] = null
        setAnchorEl(temp);
        // setAnchorEl([]);
    };
    const handleClick2 = (id,event) => {
        let temp = [...anchorEl2];
        temp[id] = event.currentTarget
        setAnchorEl2(temp);
    };
    const handleClose2 = (id,event) => {
        let temp = [...anchorEl2];
        temp[id] = null
        setAnchorEl2(temp);
        // setAnchorEl([]);
    };
    const [tabValue, setTabValue] = React.useState('1');

    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
    };
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
                    <Grid container spacing={1}>
                        {/* <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                                <ModuleHeaderText title = 'Work Schedule Config'/>
                        </Grid> */}
                        <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                            <Button variant="contained" color="success" onClick={()=>setOpenAdd(true)} className="custom-roundbutton" startIcon={<AddIcon/>}>
                                Add
                            </Button>
                            <Button variant="contained" color="primary" sx={{zIndex:1}} onClick={handleRefresh} className="custom-roundbutton" startIcon={<CachedIcon/>}>
                                Refresh
                            </Button>
                            {/* <Button startIcon={<AddIcon/>} color='success' variant="contained" onClick={()=>setOpenAdd(true)}>Add</Button> */}
                            {/* <Button startIcon={<CachedIcon/>} color='info' variant="contained" onClick={handleRefresh}>Refresh</Button> */}
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ width: '100%', typography: 'body1' }}>
                                <TabContext value={tabValue}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
                                        <Tab label="Encoder" value="1" />
                                        <Tab label="Approver" value="2" />
                                    </TabList>
                                    </Box>
                                    <TabPanel value="1">
                                        <Encoder encoder={encoder} setEncoder={setEncoder}/>
                                    </TabPanel>
                                    <TabPanel value="2">
                                        <Approver approver={approver} setApprover={setApprover}/>
                                    </TabPanel>
                                </TabContext>
                            </Box>
                        </Grid>
                        
                        
                    </Grid>
                    <SmallModal open = {openAdd} close = {()=>setOpenAdd(false)} title='Adding data'>
                        <AddWorkSchedUser close = {()=>setOpenAdd(false)} updateEncoder = {setEncoder} updateApprover = {setApprover}/>
                    </SmallModal>
                    {/* <SmallModal open = {openUpdate} close = {()=>setOpenUpdate(false)} title='Updating data'>
                        <UpdateWorkSchedUser close = {()=>setOpenUpdate(false)} updateEncoder = {setEncoder} updateApprover = {setApprover} type = {selectedType} selectedUpdate = {selectedUpdate}/>
                    </SmallModal> */}
                </Box>
        }
        </React.Fragment>
    )
}