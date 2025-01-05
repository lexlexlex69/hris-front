import { Grid,Box, Button, Autocomplete, TextField, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography, Fade, Select, FormControl, InputLabel } from "@mui/material";
import React, { useEffect, useState } from "react";
import { deletePaySetup, deletePayrollGroupDtl, getAllOffices, getPayGroupData, getPayGroupDtl, getPaySetup, getPayrollData, getPayrollGroupData } from "../../SetupPayrollRequests";
import { AddRegular } from ".././Add/AddRegular";
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import { getPayGroup } from "../../../../../customprocessdata/CustomProcessData";
import { APIError, APISuccess, StyledTableCellPayrollDtl, StyledTableCellPayrollSetup, StyledTableCellSmall, formatName, formatTwoDateToText, formatWithCommas, truncateToDecimals } from "../../../../../customstring/CustomString";
import { blue, green, grey, orange, red, yellow } from "@mui/material/colors";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DetailsDialog } from ".././dialog/DetailsDialog";
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import moment from "moment";
import { toast } from "react-toastify";
import FullDialog from "../../../../../custommodal/FullDialog";
import { PayGroupDtl } from ".././modal/PayGroupDtl";
import Swal from "sweetalert2";
import { APILoading } from "../../../../../apiresponse/APIResponse";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import FullModal from "../../../../../custommodal/FullModal";
import MediumModal from "../../../../../custommodal/MediumModal";
import { Groupings } from "../groupings/Groupings";
import { AddCasual } from "../Add/AddCasual";
import { AddCOS } from "../Add/AddCOS";
import CircleIcon from '@mui/icons-material/Circle';
import SquareIcon from '@mui/icons-material/Square';
import SmallestModal from "../../../../../custommodal/SmallestModal";
export const PayrollDtl = ({loanType,cat,empStatus,empStatusName,toAdd}) =>{
    const theme = createTheme({
        components: {
            MuiInputBase: {
                styleOverrides: {
                    input: {
                        fontSize:'.9rem',
                        // color:blue[800],
                        // fontWeight:'bold'
                    },
                    label:{
                        fontSize:'.9rem'
                    }
                }
            },
            InputLabel:{
                fontSize:'.9rem'
            }
        }
    });
    const [offices,setOffices] = useState([])
    const [openAdd,setOpenAdd] = useState(false)
    const [openGroupings,setOpenGroupings] = useState(false)
    
    const [payrollData,setPayrollData] = useState([])
    const [paySetupData,setPaySetupData] = useState([])
    const [payrollGroupData,setPayrollGroupData] = useState([])
    const [selectedPaySetup,setSelectedPaySetup] = useState({})
    useEffect(()=>{
        _init();
        _getPayData();
        _getPaySetup();
    },[])
    const _init = async () =>{
        const res = await getAllOffices();
        setOffices(res.data)
    }
    const _getPayData = async () => {
        const res = await getPayrollData()
        setPayrollData(res.data.data)
    }
    const _getPaySetup = async () => {
        const res = await getPaySetup({cat:cat})
        setPaySetupData(res.data.data)
    }
    const handleAdd = (item,e) => {
        setSelectedPaySetup(item)
        setOpenAdd(true)
        handleClose2(item.payroll_setup_id,e)
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
    // const [selectedOffice,setSelectedOffice] = useState(null)
    // const [payrollGroup,setPayrollGroup] = useState([])
    // const [selectedPayrollGroup,setSelectedPayrollGroup] = useState(null)
    // const [data,setData] = useState([])
    // const handleSelectOffice = (event,newValue)=>{
    //     setSelectedOffice(newValue)
    //     if(newValue){
    //         getPayGroup(newValue.dept_code,setPayrollGroup,'RE')
    //         setSelectedPayrollGroup(null)
    //     }
    // }
    // const handleSelectPayGroup = async (event,newValue)=>{
    //     setSelectedPayrollGroup(newValue)
    //     if(newValue){
    //         //fetch payroll data
    //         const res = await getPayrollGroupData({payroll_group_id:newValue.payroll_group_id})
    //         console.log(res.data)
    //         if(res.data.data.length>0){
    //             setSelectedEmp(res.data.data[0])
    //         }
    //         setData(res.data.data)
    //     }
    // }
    
    
    
    const [openDtlDialog,setOpenDtlDialog] = useState(false)
    const [payGroupDtlData,setPayGroupDtlData] = useState([])
    
    const handleShowPayGroup = async (item) => {
        const id = toast.loading('Fetching Records')

        try{
            const res = await getPayGroupData({period_from:item.period_from,period_to:item.period_to,emp_status:empStatus})
            setPayrollGroupData(res.data.data)
            if(res.data.data.length>0){
                toast.update(id,{
                    type:'success',
                    render:'Successfully loaded',
                    isLoading:false,
                    autoClose:true
                })
            }else{
                toast.update(id,{
                    type:'error',
                    render:'No record found',
                    isLoading:false,
                    autoClose:true
                })
            }
            
        }catch(err){
            toast.update(id,{
                type:'error',
                render:err,
                isLoading:false,
                autoClose:true
            })
        }
    }
    const [selectedGroupDtl,setSelectedGroupDtl] = useState({})
    const handleViewGroup = async (item,e) => {
        const id = toast.loading('Fetching Payroll Group Data')
        try{
            const res = await getPayGroupDtl({period_from:item.period_from,period_to:item.period_to,payroll_group_id:item.payroll_group_id})
            setPayGroupDtlData(res.data.data)
            if(res.data.data.length>0){
                toast.update(id,{
                    type:'success',
                    render:'Successfully loaded',
                    isLoading:false,
                    autoClose:true
                })
                setSelectedGroupDtl(item)
                setOpenPayGroupDtl(true)

            }else{
                toast.update(id,{
                    type:'error',
                    render:'No record found',
                    isLoading:false,
                    autoClose:true
                })
            }
            handleClose(item.payroll_group_id,e)
            
        }catch(err){
            toast.update(id,{
                type:'error',
                render:err,
                isLoading:false,
                autoClose:true
            })
        }
    }
    const [openPayGroupDtl,setOpenPayGroupDtl] = useState(false)
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
    const handleDeleteGroupDtl = (item,e) =>{
        try{
            Swal.fire({
                icon:'question',
                title:'Confirm delete payroll group data ?',
                showCancelButton:true,
                confirmButtonText:'Yes'
            }).then( async res=>{
                if(res.isConfirmed){
                    APILoading('info','Deleting payroll group data','Please wait...')
                    let t_data = {
                        payroll_group_id:item.payroll_group_id,
                        period_from:item.period_from,
                        period_to:item.period_to,
                        emp_status:item.emp_status
                    };
                    const res = await deletePayrollGroupDtl(t_data)
                    if(res.data.status === 200){
                        setPayrollData(res.data.payroll_data)
                        setPayrollGroupData(res.data.group_data)
                        APISuccess(res.data.message)
                    }else{
                        APIError(res.data.message)
                    }
                    handleClose(item.payroll_group_id,e);
                }
            })
        }catch(err){

        }
    }
    const handleDelPaySetup = async (item,e) => {
        Swal.fire({
            icon:'question',
            title:'Confirm Delete ?',
            text:'Action cannot be reverted',
            showCancelButton:true,
            confirmButtonText:'Yes'
        }).then(async res=>{
            if(res.isConfirmed){
                try{
                    APILoading('info','Deleting data','Please wait...')
                    let t_data = {
                        payroll_setup_id:item.payroll_setup_id,
                        payroll_no:item.payroll_no
                    }
                    const res = await deletePaySetup(t_data);
                    if(res.data.status === 200){
                        //remove row
                        let temp = [...paySetupData];
                        let index = temp.findIndex(el=>el.payroll_setup_id === item.payroll_setup_id);
                        temp.splice(index,1);
                        setPaySetupData(temp)
                        handleClose2(item.payroll_setup_id,e)
                        APISuccess(res.data.message)
                    }else{
                        APIError(res.data.message)
                    }
                }catch(err){
                    APIError(err)
                }
                
            }
        })
    }
    const reEmpStatus = () => {
        switch(empStatus){
            case 'RE':
            return <AddRegular offices = {offices} selectedPaySetup={selectedPaySetup}/>;
            break;
            case 'CS':
            return <AddCasual offices = {offices} selectedPaySetup={selectedPaySetup}/>
            break;
            case 'COS':
            return <AddCOS offices = {offices} selectedPaySetup={selectedPaySetup}/>
            break;
        }
    }
    const [statusList,setStatusList] = useState([
        {
            status_no:1,
            status_text:'Created'
        },{
            status_no:2,
            status_text:'Processed'
        },{
            status_no:3,
            status_text:'Printed'
        },{
            status_no:4,
            status_text:'Finalized'
        },{
            status_no:5,
            status_text:'Locked'
        }
        ]);
    const [selUpStat,setSelUpStat] = useState([])
    const [openCStatus,setOpenCStatus] = useState(false);
    const handleChangeStatus  = (item,e) => {
        setSelUpStat(item);
        setOpenCStatus(true)
    }
    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-start',gap:1}}>
                    {/* <Button onClick={handleAdd} variant="contained" className="custom-roundbutton" startIcon={<AddIcon/>}>Add</Button> */}
                    
                </Grid>
                <Grid item xs={7}>
                    <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <Typography sx={{textAlign:'right',mb:1,color:grey[800],fontWeight:'bold',p:1}}>Payroll Setup</Typography>
                    <Button onClick={handleGroupings} variant="contained" className="custom-roundbutton" color='info' startIcon={<SettingsIcon/>}>Groupings</Button>

                    </Box>
                    <Paper>
                        <TableContainer sx={{maxHeight:'50vh'}}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCellPayrollSetup>
                                            Payroll No.
                                        </StyledTableCellPayrollSetup>
                                        <StyledTableCellPayrollSetup>
                                            Payroll Type
                                        </StyledTableCellPayrollSetup>
                                        <StyledTableCellPayrollSetup>
                                            Period Covered
                                        </StyledTableCellPayrollSetup>
                                        <StyledTableCellPayrollSetup>
                                            Clerk
                                        </StyledTableCellPayrollSetup>
                                        <StyledTableCellPayrollSetup>
                                        
                                        </StyledTableCellPayrollSetup>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        // payrollData.length>0
                                        // ?
                                        //     payrollData.map((item,key)=>{
                                        //         return(
                                        //             <TableRow key = {key} hover sx={{'&:hover':{cursor:'pointer'}}} onClick = {()=>handleShowPayGroup(item)}>
                                        //                 <TableCell>{moment(item.period_from).format('MMMM DD, YYYY')}</TableCell>
                                        //                 <TableCell>{moment(item.period_to).format('MMMM DD, YYYY')}</TableCell>
                                        //             </TableRow>
                                        //         )
                                                
                                        //     })
                                        // :
                                        paySetupData.length>0
                                        ?
                                            paySetupData.map((item)=>{
                                                return (
                                                <TableRow key = {item.payroll_setup_id} hover>
                                                    <StyledTableCellPayrollSetup hover sx={{'&:hover':{cursor:'pointer'}}} onClick = {()=>handleShowPayGroup(item)}>{item.payroll_no}</StyledTableCellPayrollSetup>
                                                    <StyledTableCellPayrollSetup hover sx={{'&:hover':{cursor:'pointer'}}} onClick = {()=>handleShowPayGroup(item)}>{item.tran_type_desc}</StyledTableCellPayrollSetup>
                                                    <StyledTableCellPayrollSetup hover sx={{'&:hover':{cursor:'pointer'}}} onClick = {()=>handleShowPayGroup(item)}>{formatTwoDateToText(item.period_from,item.period_to)}</StyledTableCellPayrollSetup>
                                                    <StyledTableCellPayrollSetup sx={{'&:hover':{cursor:'pointer'}}} onClick = {()=>handleShowPayGroup(item)}>
                                                    {item.clerk_name}
                                                    </StyledTableCellPayrollSetup>
                                                    <StyledTableCellPayrollSetup>
                                                    <Button
                                                            id={item.payroll_setup_id}
                                                            aria-controls={Boolean(item.payroll_setup_id)}
                                                            aria-haspopup="true"
                                                            aria-expanded={Boolean(item.payroll_setup_id)}
                                                            onClick={(e)=>handleClick2(item.payroll_setup_id,e)}
                                                            variant="contained"
                                                            color="secondary"
                                                            // size="small"
                                                            className="custom-roundbutton"
                                                            endIcon={<ArrowDropDownIcon/>}
                                                        >
                                                            Actions
                                                        </Button>
                                                        <Menu
                                                            id={item.payroll_setup_id}
                                                            anchorEl={anchorEl2[item.payroll_setup_id]}
                                                            open={Boolean(anchorEl2[item.payroll_setup_id])}
                                                            onClose={(e)=>handleClose2(item.payroll_setup_id,e)}
                                                            MenuListProps={{
                                                            'aria-labelledby': `basic-button-${item.payroll_setup_id}`,
                                                            }}
                                                        >
                                                            
                                                            <MenuItem size='small' onClick={(e)=>handleAdd(item,e)}>
                                                                <ListItemIcon color="success">
                                                                    <AddIcon color="success" fontSize="small" />
                                                                </ListItemIcon>
                                                                <ListItemText>Add</ListItemText>
                                                            </MenuItem>
                                                            <MenuItem size='small'>
                                                                <ListItemIcon color="info">
                                                                    <EditIcon color="info" fontSize="small" />
                                                                </ListItemIcon>
                                                                <ListItemText>Update</ListItemText>
                                                            </MenuItem>
                                                            <MenuItem size='small' onClick={(e)=>handleDelPaySetup(item,e)}>
                                                                <ListItemIcon>
                                                                    <DeleteIcon color="error" fontSize="small" />
                                                                </ListItemIcon>
                                                                <ListItemText>Delete</ListItemText>
                                                            </MenuItem>
                                                        </Menu>
                                                    {/* <Button variant="contained" className="custom-roundbutton" startIcon={<AddIcon/>} onClick={()=>handleAdd(item)} size="small">Add</Button> */}
                                                    </StyledTableCellPayrollSetup>
                                                </TableRow>
                                                )
                                            })
                                        :
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">No Data</TableCell>
                                        </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                <Grid item xs={5}>
                    <Typography sx={{textAlign:'right',mb:1,color:grey[700],fontWeight:'bold',p:1}}>Payroll Group Details</Typography>
                    <Box sx={{display:'flex',justifyContent:'space-between',mb:1}}>
                        <small><CircleIcon sx={{color:green[800]}} fontSize="small"/> Created</small>
                        <small><CircleIcon sx={{color:yellow[800]}} fontSize="small"/> Processed</small>
                        <small><CircleIcon sx={{color:orange[800]}} fontSize="small"/> Printed</small>
                        <small><CircleIcon sx={{color:blue[800]}} fontSize="small"/> Finalized</small>
                        <small><CircleIcon sx={{color:red[800]}} fontSize="small"/> Locked</small>

                    </Box>
                    <Paper>
                        <TableContainer sx={{maxHeight:'50vh'}}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCellPayrollDtl sx={{background:blue[700],color:'#fff'}}>
                                            Department
                                        </StyledTableCellPayrollDtl>
                                        <StyledTableCellPayrollDtl sx={{background:blue[700],color:'#fff'}}>
                                            Group Name
                                        </StyledTableCellPayrollDtl>
                                        <StyledTableCellPayrollDtl sx={{background:blue[700],color:'#fff'}}>
                                            Total Records
                                        </StyledTableCellPayrollDtl>
                                        <StyledTableCellPayrollDtl sx={{background:blue[700],color:'#fff'}}>
                                            {/* Actions */}
                                        </StyledTableCellPayrollDtl>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        payrollGroupData.length>0
                                        ?
                                            payrollGroupData.map((item,key)=>{
                                                return(
                                                    <TableRow key = {item.payroll_group_id} hover sx={{'&:hover':{cursor:'pointer'}}}>
                                                        <TableCell sx={{color:
                                                            item.status_no === 5
                                                            ?red[800]
                                                            :item.status_no === 4
                                                            ?blue[800]
                                                            :item.status_no === 3
                                                            ?orange[800]
                                                            :item.status_no === 2
                                                            ?yellow[800]
                                                            :green[800],fontWeight:'bold'}}>{item.short_name}</TableCell>
                                                        <TableCell>{item.group_name}</TableCell>
                                                        <TableCell>{item.total_records}</TableCell>
                                                        {/* <TableCell><Button variant="outlined" size="small" onClick={()=>handleViewGroup(item)}>View / Update</Button></TableCell> */}
                                                        <TableCell>
                                                        <Button
                                                            id={item.payroll_group_id}
                                                            aria-controls={Boolean(item.payroll_group_id)}
                                                            aria-haspopup="true"
                                                            aria-expanded={Boolean(item.payroll_group_id)}
                                                            onClick={(e)=>handleClick(item.payroll_group_id,e)}
                                                            variant="contained"
                                                            color="secondary"
                                                            // size="small"
                                                            className="custom-roundbutton"
                                                            endIcon={<ArrowDropDownIcon/>}
                                                        >
                                                            Actions
                                                        </Button>
                                                        <Menu
                                                            id={item.payroll_group_id}
                                                            anchorEl={anchorEl[item.payroll_group_id]}
                                                            open={Boolean(anchorEl[item.payroll_group_id])}
                                                            onClose={(e)=>handleClose(item.payroll_group_id,e)}
                                                            MenuListProps={{
                                                            'aria-labelledby': `basic-button-${item.payroll_group_id}`,
                                                            }}
                                                        >
                                                            
                                                            <MenuItem onClick={(e)=>handleViewGroup(item,e)} size='small'>
                                                                <ListItemIcon color="success">
                                                                    <EditIcon color="success" fontSize="small" />
                                                                </ListItemIcon>
                                                                <ListItemText>View / Update</ListItemText>
                                                            </MenuItem>
                                                            <MenuItem  size='small' onClick={(e)=>handleChangeStatus(item,e)}>
                                                                <ListItemIcon>
                                                                    <ChangeCircleIcon color="info" fontSize="small" />
                                                                </ListItemIcon>
                                                                <ListItemText>Change Status</ListItemText>
                                                            </MenuItem>
                                                            <MenuItem onClick={(e)=>handleDeleteGroupDtl(item,e)} size='small' disabled={item.status_no === 4 || item.status_no === 5?true:false}>
                                                                <ListItemIcon>
                                                                    <DeleteIcon color="error" fontSize="small" />
                                                                </ListItemIcon>
                                                                <ListItemText>Delete</ListItemText>
                                                            </MenuItem>
                                                        </Menu>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                                
                                            })
                                        :
                                        <TableRow>
                                            <TableCell colSpan={3} align="center">No Data</TableCell>
                                        </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                
                <FullModal open = {openAdd} close = {handleCloseAdd} title={`Adding ${empStatusName} Payroll`}>
                    {/* <AddRegular offices = {offices} selectedPaySetup={selectedPaySetup}/> */}
                    {reEmpStatus()}
                </FullModal>
                <MediumModal open = {openGroupings} close = {handleCloseGroupings} title={`${empStatusName} Payroll Groupings`}>
                    <Groupings offices = {offices} emp_status = {empStatus}/>
                </MediumModal>
                <FullDialog open = {openPayGroupDtl} close = {()=>setOpenPayGroupDtl(false)} title='Employee List'>
                    <PayGroupDtl selectedData={payGroupDtlData} setPayGroupDtlData = {setPayGroupDtlData} setPayrollGroupData={setPayrollGroupData} selectedGroupDtl = {selectedGroupDtl} setSelectedGroupDtl = {setSelectedGroupDtl} loanType={loanType}/>
                </FullDialog>
                <SmallestModal open = {openCStatus} close = {()=>setOpenCStatus(false)} title='Changing Status'>
                    <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Payroll Status</InputLabel>
                    <Select
                        labelId="change-status"
                        id="change-status"
                        value={selUpStat}
                        label="Payroll Status"
                        onChange={(val)=>setSelUpStat(val.target.value)}
                    >
                        {
                            statusList.map((item)=>{
                                return(
                                <MenuItem key = {item.status_no}>{item.status_text}</MenuItem>
                                )
                            })
                        }
                    </Select>
                    </FormControl>
                </SmallestModal>
            </Grid>
        </Box>

    )
}