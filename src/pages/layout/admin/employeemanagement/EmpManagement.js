import { Box, Button, Grid, ListItemIcon, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React, { useEffect,useState } from "react";
import { checkPermission } from '../../permissionrequest/permissionRequest';
import {blue,red,green,orange, grey} from '@mui/material/colors'
import {useNavigate}from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DashboardLoading from "../../loader/DashboardLoading";
import ModuleHeaderText from "../../moduleheadertext/ModuleHeaderText";
import { toast } from "react-toastify";
import { Search } from "./component/Search";
import EditIcon from '@mui/icons-material/Edit';
import moment from "moment";
import SmallModal from "../../custommodal/SmallModal";
import { UpdateModal } from "./component/UpdateModal";
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { AddModal } from "./component/AddModal";
import { getAllOffices, getEmpStatus } from "./EmpManagementRequest";
import MediumModal from "../../custommodal/MediumModal";
import LargeModal from "../../custommodal/LargeModal";
import { DeptGroupings } from "./component/DeptGroupings";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
export const EmpManagement = () =>{
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoading,setIsLoading] = useState(true)
    const [data,setData] = useState([])
    const [selectedData,setSelectedData] = useState([])
    const [openUpdate,setOpenUpdate] = useState(false)
    const [openAdd,setOpenAdd] = useState(false)
    const [empStatusData,setEmpStatusData] = useState([])
    const [officesData,setOfficesData] = useState([])
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    useEffect(()=>{
        checkPermission(79)
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
        const emp_status = await getEmpStatus();
        // console.log(emp_status.data)
        setEmpStatusData(emp_status.data)
        const offices = await getAllOffices();
        setOfficesData(offices.data)
    }
    const handleSelect = (row)=>{
        console.log(row)
        setSelectedData(row)
        setOpenUpdate(true)
    }
    const [openGroupings,setOpenGroupings] = useState(false)
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
                    <Grid container spacing={2}>
                        {/* <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                                <ModuleHeaderText title = 'Employee Management'/>
                        </Grid> */}
                        <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                            <Search setData ={setData}/>
                            <Box sx={{display:'flex',gap:1}}>
                            <Button
                                id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                                variant="contained"
                                endIcon={<KeyboardArrowDownIcon />}
                                className="custom-roundbutton"
                                color="secondary"
                            >
                                Actions
                            </Button>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={()=>setOpenAdd(true)}>
                                    <ListItemIcon>
                                        <AddIcon fontSize="small" color="success"/>
                                    </ListItemIcon>
                                    <ListItemText>Add</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={()=>setOpenGroupings(true)}>
                                    <ListItemIcon>
                                        <AddIcon fontSize="small" color="success"/>
                                    </ListItemIcon>
                                    <ListItemText>Division/Section</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={handleClose} disableRipple>Update Inactive</MenuItem>
                            </Menu>
                            {/* <Button startIcon={<AddIcon/>} variant="contained" color='success' sx={{pl:3,pr:3}} onClick={()=>setOpenAdd(true)} className="custom-roundbutton">Add</Button>
                            <Button startIcon={<SettingsIcon/>} variant="contained" sx={{pl:3,pr:3}} onClick={()=>setOpenGroupings(true)}  className="custom-roundbutton">Division/Section</Button> */}
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper>
                                <TableContainer sx={{maxHeight:'60dvh'}}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{background:grey[300]}}>
                                                    Employment Status
                                                </TableCell>
                                                <TableCell sx={{background:grey[300]}}>
                                                    First Name
                                                </TableCell>
                                                <TableCell sx={{background:grey[300]}}>
                                                    Middle Name
                                                </TableCell>
                                                <TableCell sx={{background:grey[300]}}>
                                                    Last Name
                                                </TableCell>
                                                <TableCell sx={{background:grey[300]}}>
                                                    Department
                                                </TableCell>
                                                <TableCell sx={{background:grey[300]}}>
                                                    Position
                                                </TableCell>
                                                <TableCell sx={{background:grey[300]}}>
                                                    Date of Birth
                                                </TableCell>
                                                <TableCell sx={{background:grey[300]}}>
                                                    Date Hired
                                                </TableCell>
                                                <TableCell sx={{background:grey[300]}}>
                                                    Action
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                data.map((item,key)=>{
                                                    return(
                                                        <TableRow key={key} hover>
                                                            <TableCell>
                                                                {item.description}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.fname}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.mname}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.lname}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.dept_title}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.position_name}
                                                            </TableCell>
                                                            <TableCell>
                                                                {moment(item.dob,'YYYY-MM-DD').format('MMM DD, YYYY')}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.date_hired?moment(item.date_hired).format('MMMM DD, YYYY'):'N/A'}
                                                            </TableCell>
                                                            
                                                            <TableCell>
                                                                <Box>
                                                                    <Button startIcon={<EditIcon/>} variant="contained" onClick={()=>handleSelect(item)} className="custom-roundbutton" color="secondary">Update</Button>
                                                                </Box>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                    
                                                })
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                            <SmallModal open = {openUpdate} close = {()=>setOpenUpdate(false)} title='Updating Employee Info'>
                                <UpdateModal data = {data} selectedData = {selectedData} close = {()=>setOpenUpdate(false)} setData = {setData} empStatusData = {empStatusData} officesData = {officesData}/>
                            </SmallModal>
                            <SmallModal  open = {openAdd} close = {()=>setOpenAdd(false)} title='Adding Data'>
                                <AddModal data = {data} selectedData = {selectedData} close = {()=>setOpenAdd(false)} setData = {setData} empStatusData = {empStatusData} officesData = {officesData}/>
                            </SmallModal>
                            <LargeModal open = {openGroupings} close = {()=>setOpenGroupings(false)} title='Division/Section'>
                                <DeptGroupings offices={officesData}/>
                            </LargeModal>
                        </Grid>
                    </Grid>
                </Box>
        }
        </React.Fragment>
    )
}