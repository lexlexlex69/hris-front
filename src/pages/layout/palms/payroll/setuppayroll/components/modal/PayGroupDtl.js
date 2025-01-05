import { Grid,Box, Button, Autocomplete, TextField, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography, Fade, Checkbox, FormControlLabel, IconButton } from "@mui/material";
import { blue, grey, orange } from "@mui/material/colors";
import React, { useState, useEffect, useMemo } from 'react';
import { APIError, APISuccess, StyledTableCellSmall, formatName, formatWithCommas, truncateToDecimals } from "../../../../../customstring/CustomString";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Swal from "sweetalert2";
import { deleteEmpPayroll, deleteLoan, finalizedPayrollRecords, lockPayrollRecords, savePayrollUpdate, unlockPayrollRecords } from "../../SetupPayrollRequests";
import { APILoading } from "../../../../../apiresponse/APIResponse";
import { ManualAddSelected } from "../../../billing/components/ManualAddSelected";
import SmallestModal from "../../../../../custommodal/SmallestModal";
export const PayGroupDtl = ({selectedData,setPayGroupDtlData,setPayrollGroupData,selectedGroupDtl,setSelectedGroupDtl,loanType})=>{
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
            },
            MuiFormControlLabel:{
                styleOverrides:{
                    label:{
                        fontSize:'.9rem'
                    }
                }
            }

        }
    });
    const [selectedEmp,setSelectedEmp] = useState()
    const [selectedEmpDefault,setSelectedEmpDefault] = useState()
    const [data,setData] = useState(selectedData)
    const [searchVal,setSearchVal] = useState('');
    const filterData = data.filter(el=>el.fname.toUpperCase().trim().includes(searchVal.toUpperCase().trim()) || el.lname.toUpperCase().trim().includes(searchVal.toUpperCase().trim()));
    const [editData,setEditData] = useState(false)
    const [anchorEl, setAnchorEl] = useState([]);
    const [anchorElEmpAction, setAnchorElEmpAction] = useState([]);
    const [bottom,setBottom] = useState({
        atm_15:false,
        atm_30:false,
        add_15:false,
        hold:false,
        hold_remarks:'',
        vouchered:false
    })
    // const open = Boolean(anchorEl);
    const handleClick = (id,event) => {
        let temp = [...anchorEl];
        temp[id] = event.currentTarget
        setAnchorEl(temp);
    };
    const handleClickEmpAction = (id,event) => {
        let temp = [...anchorElEmpAction];
        temp[id] = event.currentTarget
        setAnchorElEmpAction(temp);
    };
    const handleClose = (id,event) => {
        let temp = [...anchorEl];
        temp[id] = null
        setAnchorEl(temp);
        // setAnchorEl([]);
    };
    const handleCloseEmpAction = (id,event) => {
        let temp = [...anchorElEmpAction];
        temp[id] = null
        setAnchorElEmpAction(temp);
        // setAnchorEl([]);
    };
    const handleEditEmpAction = (item,e) => {
        setSelectedEmp(item);
        setEditData(true)
        handleCloseEmpAction(item.payroll_data_id,e)
    }
    const handleDeleteEmpAction = async (item,e) => {
        Swal.fire({
            icon:'question',
            title:'Confirm Delete ?',
            showCancelButton:true,
            confirmButtonText:'Yes'
        }).then(async res=>{
            if(res.isConfirmed){
                try{
                    APILoading('info','Deleting Employee Payroll','Please wait...')
                    let t_data = {
                        payroll_data_id:item.payroll_data_id,
                        payroll_group_id:item.payroll_group_id,
                        period_from:item.period_from,
                        period_to:item.period_to,
                        emp_status:item.emp_status,
                        payroll_no:item.payroll_no
                    };
                    const res = await deleteEmpPayroll(t_data);
                    if(res.data.status === 200){
                        setPayrollGroupData(res.data.group_data)
                        setData(res.data.data)
                        APISuccess(res.data.message)
                    }else{
                        APIError(res.data.message)
                    }
                }catch(err){
                    APIError(err)
                }
                
            }
        })
        handleCloseEmpAction(item.payroll_data_id,e)
    }
    const handleCancel = ()=>{
        setSelectedEmp(selectedEmpDefault)
        setBottom({
            atm_15:false,
            atm_30:false,
            add_15:false,
            hold:false,
            hold_remarks:'',
            vouchered:false
        })
        setEditData(false)
    }
    const handleSelectRow = (item) => {
        console.log(selectedGroupDtl)
        console.log(item)
        setSelectedEmp(item)
        setSelectedEmpDefault(item)
        setEditData(false);
        // setOpenDtlDialog(true)
    }
    useEffect(()=>{
        const getData = setTimeout(() => {
            let temp = {...selectedEmp};
            let t_loan = 0;
            if(temp.loan){
                 t_loan = JSON.parse(temp.loan).map(el=>parseFloat(el.amount)).reduce((total,a)=>{
                    return total+a
                },0)
            }
            
            let t_deductions = parseFloat(temp?.provident)+parseFloat(temp?.pagibig)+parseFloat(temp?.gsis_personal_share)+parseFloat(temp?.ph_personal_share)+parseFloat(temp?.tax)+t_loan;

            let add_earning = parseFloat(temp?.pera)+parseFloat(temp?.rice_subsidy)+parseFloat(temp?.quarterly_allowance)+parseFloat(temp?.subsistence_allowance)+parseFloat(temp?.laundry_allowance);

            let new_accrued = temp?.m_salary-temp?.total_wopay;
            let new_15= (((new_accrued+add_earning)-t_deductions))/2;
            let new_30= truncateToDecimals((((new_accrued+parseFloat(temp?.pera))-t_deductions))/2);
            temp.amount_accrued = new_accrued
            temp.total_deductions = t_deductions
            temp.amount_15 = parseFloat(Math.round(new_15*100)/100)
            temp.amount_30 = parseFloat(new_30)
            temp.additional_earning = add_earning;
            setSelectedEmp(temp)
        }, 2000)

        return () => clearTimeout(getData)
    },[selectedEmp?.total_wopay,selectedEmp?.tax,selectedEmp?.provident,selectedEmp?.pera,selectedEmp?.rice_subsidy,selectedEmp?.quarterly_allowance,selectedEmp?.subsistence_allowance,selectedEmp?.laundry_allowance,selectedEmp?.pagibig,,selectedEmp?.gsis_personal_share,,selectedEmp?.ph_personal_share,selectedEmp?.loan]);
    const handleSave = async () => {
        try{
            APILoading('info','Saving update','Please wait...');
            const res = await savePayrollUpdate({data:selectedEmp});
            if(res.data.status === 200){
                APISuccess(res.data.message)
                setEditData(false)
            }else{
                APIError(res.data.message)
            }
        }catch(err){
            APIError(err)
        }
        
    }
    const handleDeleteLoan = (item,e) => {
        Swal.fire({
            icon:'question',
            title:'Confirm Delete ?',
            showCancelButton:true,
            confirmButtonText:'Yes'
        }).then(async res=>{
            if(res.isConfirmed){
                APILoading('info','Deleting loan','Please wait...')
                const res = await deleteLoan({emp_billing_id:item.emp_billing_id});
                if(res.data.status === 200){
                    let temp = {...selectedEmp}
                    let new_loan = temp.loan?JSON.parse(temp.loan):[];
                    let index = new_loan.findIndex(el=>el.emp_billing_id === item.emp_billing_id);
                    let temp2 = [...selectedData];
                    let index2 = temp2.findIndex(el=>el.payroll_data_id === selectedEmp.payroll_data_id);
                    new_loan.splice(index,1);
                    if(new_loan.length>0){
                        temp.loan = JSON.stringify(new_loan)
                        temp2[index2].loan = JSON.stringify(new_loan)

                    }else{
                        temp.loan = null
                        temp2[index2].loan = null
                    }
                    setSelectedEmp(temp)
                    setPayGroupDtlData(temp2)
                    handleClose(item.emp_billing_id,e)
                    APISuccess(res.data.message)

                    let t_loan = 0;
                    if(temp.loan){
                            t_loan = JSON.parse(temp.loan).map(el=>parseFloat(el.amount)).reduce((total,a)=>{
                            return total+a
                        },0)
                    }
                    
                    let t_deductions = parseFloat(temp?.provident)+parseFloat(temp?.pagibig)+parseFloat(temp?.gsis_personal_share)+parseFloat(temp?.ph_personal_share)+parseFloat(temp?.tax)+t_loan;

                    let new_accrued = temp?.m_salary-temp?.total_wopay;
                    let new_15= (((new_accrued+parseFloat(temp?.pera)+parseFloat(temp?.rice_subsidy)+parseFloat(temp?.quarterly_allowance)+parseFloat(temp?.subsistence_allowance)+parseFloat(temp?.laundry_allowance))-t_deductions))/2;
                    let new_30= truncateToDecimals((((new_accrued+parseFloat(temp?.pera))-t_deductions))/2);
                    temp.amount_accrued = new_accrued
                    temp.total_deductions = t_deductions
                    temp.amount_15 = parseFloat(Math.round(new_15*100)/100)
                    temp.amount_30 = parseFloat(new_30)

                    try{
                        APILoading('info','Updating payroll','Please wait...');
                        const res = await savePayrollUpdate({data:temp});
                        if(res.data.status === 200){
                            APISuccess(res.data.message)
                            setEditData(false)
                        }else{
                            APIError(res.data.message)
                        }
                    }catch(err){
                        APIError(err)
                    }

                }else{
                    APIError(res.data.message)
                }
            }
        })
    }
    const handleUpdateData = async (insertedData) => {
        let temp = {...selectedEmp}
        let old_loan = selectedEmp.loan?JSON.parse(selectedEmp.loan):[];
        let new_loan = insertedData[0];
        
        let temp2 = [...selectedData];
        let index2 = temp2.findIndex(el=>el.payroll_data_id === selectedEmp.payroll_data_id);
        let old_loan2 = temp2[index2].loan?JSON.parse(temp2[index2].loan):[];

        old_loan.push(new_loan)
        old_loan2.push(new_loan)
        temp.loan = JSON.stringify(old_loan);
        temp2[index2].loan = JSON.stringify(old_loan2);

        setSelectedEmp(temp)
        setPayGroupDtlData(temp2)

        let t_loan = 0;
        if(temp.loan){
                t_loan = JSON.parse(temp.loan).map(el=>parseFloat(el.amount)).reduce((total,a)=>{
                return total+a
            },0)
        }
        
        let t_deductions = parseFloat(temp?.provident)+parseFloat(temp?.pagibig)+parseFloat(temp?.gsis_personal_share)+parseFloat(temp?.ph_personal_share)+parseFloat(temp?.tax)+t_loan;

        let new_accrued = temp?.m_salary-temp?.total_wopay;
        let new_15= (((new_accrued+parseFloat(temp?.pera)+parseFloat(temp?.rice_subsidy)+parseFloat(temp?.quarterly_allowance)+parseFloat(temp?.subsistence_allowance)+parseFloat(temp?.laundry_allowance))-t_deductions))/2;
        let new_30= truncateToDecimals((((new_accrued+parseFloat(temp?.pera))-t_deductions))/2);
        temp.amount_accrued = new_accrued
        temp.total_deductions = t_deductions
        temp.amount_15 = parseFloat(Math.round(new_15*100)/100)
        temp.amount_30 = parseFloat(new_30)

        try{
            APILoading('info','Updating Payroll','Please wait...');
            const res = await savePayrollUpdate({data:temp});
            if(res.data.status === 200){
                APISuccess(res.data.message)
                setEditData(false)
            }else{
                APIError(res.data.message)
            }
        }catch(err){
            APIError(err)
        }


    }
    const [selectedDataManual,setSelectedDataManual] = useState(selectedEmp);

    const [openManualAdd,setOpenManualAdd] = useState(false);
    const handleLockRecords = () => {
        try{
            Swal.fire({
                icon:'question',
                title:'Confirm Lock Payroll Records?',
                showCancelButton:true,
                confirmButtonText:'Yes'
            }).then(async res=>{
                if(res.isConfirmed){
                    APILoading('info','Locking Payroll Records','Please wait...');
                    let t_data = {
                        payroll_no:selectedGroupDtl.payroll_no,
                        payroll_group_id:selectedGroupDtl.payroll_group_id,
                        period_from:selectedGroupDtl.period_from,
                        period_to:selectedGroupDtl.period_to,
                        emp_status:selectedGroupDtl.emp_status
                    };
                    const res = await lockPayrollRecords(t_data)

                    if(res.data.status === 200){
                        let temp = {...selectedGroupDtl}
                        temp.status_no = 5;
                        temp.status_text = 'LOCKED';
                        setSelectedGroupDtl(temp)
                        setPayrollGroupData(res.data.group_data)
                        APISuccess(res.data.message)
                    }else{
                        APIError(res.data.message)
                    }
                }
            })

        }catch(err){
            APIError(err)
        }
    }
    const [openMasterPassword,setOpenMasterPassword] = useState(false)
    const [masterPassword,setMasterPassword] = useState('')
    const handleUnlockRecords = async (e) => {
        e.preventDefault();
        try{
            if(masterPassword === '123456'){
                APILoading('info','Unlocking Payroll Records','Please wait...');
                let t_data = {
                    payroll_no:selectedGroupDtl.payroll_no,
                    payroll_group_id:selectedGroupDtl.payroll_group_id,
                    period_from:selectedGroupDtl.period_from,
                    period_to:selectedGroupDtl.period_to,
                    emp_status:selectedGroupDtl.emp_status,
                };
                const res = await unlockPayrollRecords(t_data)

                if(res.data.status === 200){
                    let temp = {...selectedGroupDtl}
                    temp.status_no = 1;
                    temp.status_text = 'CREATED';
                    setSelectedGroupDtl(temp)
                    setPayrollGroupData(res.data.group_data)
                    setOpenMasterPassword(false)
                    APISuccess(res.data.message)
                    setMasterPassword('')
                }else{
                    APIError(res.data.message)
                }
            }else{
                Swal.fire({
                    icon:'error',
                    title:'Invalid Master Password'
                })
            }
            

        }catch(err){
            APIError(err)
        }
    }
    const handleCloseMasterPass = () => {
        setOpenMasterPassword(false)
        setMasterPassword('')

    }
    const handleFinalizeRecords = () => {
        try{
            Swal.fire({
                icon:'question',
                title:'Confirm Finalize Payroll Records?',
                showCancelButton:true,
                confirmButtonText:'Yes'
            }).then(async res=>{
                if(res.isConfirmed){
                    APILoading('info','Finalizing Payroll Records','Please wait...');
                    let t_data = {
                        emp_status:selectedGroupDtl.emp_status,
                        payroll_no:selectedGroupDtl.payroll_no,
                        payroll_group_id:selectedGroupDtl.payroll_group_id,
                        period_from:selectedGroupDtl.period_from,
                        period_to:selectedGroupDtl.period_to
                    };
                    // console.log(t_data)
                    const res = await finalizedPayrollRecords(t_data)

                    if(res.data.status === 200){
                        let temp = {...selectedGroupDtl}
                        temp.status_no = 4;
                        temp.status_text = 'FINALIZED';   
                        setSelectedGroupDtl(temp)
                        setPayrollGroupData(res.data.group_data)
                        APISuccess(res.data.message)
                    }else{
                        APIError(res.data.message)
                    }
                }
            })

        }catch(err){
            APIError(err)
        }
    }
    const handleClearPayroll = async (item,e) =>{
        try{
            APILoading('info','Clearing payroll','Please wait...');
            let temp = {...item}
            console.log(item)
            temp.absent_days = 0;
            temp.accrued = 0;
            temp.additional_earning = 0;
            temp.adjust_15 = 0;
            temp.adjust_30 = 0;
            temp.amount_07 = 0;
            temp.amount_23 = 0;
            temp.amount_15 = 0;
            temp.amount_30 = 0;
            temp.amount_accrued = 0;
            temp.ecc = 0;
            temp.gsis_gov_share = 0;
            temp.gsis_personal_share = 0;
            temp.laundry_allowance = 0;
            temp.m_salary = 0;
            temp.other_deduction = 0;
            temp.pagibig = 0;
            temp.pagibiggov = 0;
            temp.pera = 0;
            temp.ph_gov_share = 0;
            temp.ph_personal_share = 0;
            temp.provident = 0;
            temp.quarterly_allowance = 0;
            temp.representation = 0;
            temp.rice_subsidy = 0;
            temp.sss = 0;
            temp.subsistence_allowance = 0;
            temp.tax = 0;
            temp.total_deductions = 0;
            temp.total_wopay = 0;
            temp.travelling = 0;
            const res = await savePayrollUpdate({data:temp});
            if(res.data.status === 200){
                setData(res.data.data)
                APISuccess(res.data.message)
                setEditData(false)
                handleCloseEmpAction(item.payroll_data_id,e)
            }else{
                APIError(res.data.message)
            }
        }catch(err){
            APIError(err)
        }
    }
    return (
        <Grid container >
            <Grid item xs={12}>
                    <Paper sx={{p:1,display:'flex',gap:1,background:blue[100]}}>
                        <Grid item xs={5} sx={{display:'flex',flexDirection:'column',gap:1,p:2,background:'#fff',borderRadius:''}}>
                        <Box>
                            <TextField label = 'Search Employee' placeholder ='Firstname | Lastname' size="small" value={searchVal} onChange={(val)=>setSearchVal(val.target.value)} fullWidth/>

                            <Paper sx={{p:1}}>
                                <TableContainer sx={{maxHeight:'65vh'}}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCellSmall>
                                                    Employee Name
                                                </StyledTableCellSmall>
                                                <StyledTableCellSmall>
                                                    Salary 01-15
                                                </StyledTableCellSmall>
                                                <StyledTableCellSmall>
                                                    Salary 16-30
                                                </StyledTableCellSmall>
                                                <StyledTableCellSmall>
                                                </StyledTableCellSmall>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                filterData.length>0
                                                ?
                                                    filterData.map((item)=>{
                                                        return (
                                                            <TableRow key = {item.payroll_data_id} sx={{'&:hover':{background:grey[300],cursor:'pointer'}}} selected ={selectedEmp?.emp_no===item.emp_no?true:false}>
                                                                <StyledTableCellSmall onClick={()=>handleSelectRow(item)}>
                                                                    {formatName(item.fname,item.mname,item.lname,item.extname,1)}
                                                                </StyledTableCellSmall>
                                                                <StyledTableCellSmall onClick={()=>handleSelectRow(item)}>
                                                                    {formatWithCommas(parseFloat(item.amount_15).toFixed(2))}
                                                                </StyledTableCellSmall>
                                                                <StyledTableCellSmall onClick={()=>handleSelectRow(item)}>
                                                                    {formatWithCommas(parseFloat(item.amount_30).toFixed(2))}
                                                                </StyledTableCellSmall>
                                                                <StyledTableCellSmall>
                                                                <Button
                                                                    id={item.payroll_data_id}
                                                                    aria-controls={Boolean(item.payroll_data_id)}
                                                                    aria-haspopup="true"
                                                                    aria-expanded={Boolean(item.payroll_data_id)}
                                                                    onClick={(e)=>handleClickEmpAction(item.payroll_data_id,e)}
                                                                    variant="contained"
                                                                    color="secondary"
                                                                    size="small"
                                                                    disabled={selectedGroupDtl.status_no === 5 || selectedGroupDtl.status_no === 4?true:false}
                                                                    className="custom-roundbutton"
                                                                    endIcon={<ArrowDropDownIcon/>}

                                                                >
                                                                    Actions
                                                                </Button>
                                                                <Menu
                                                                    id={item.payroll_data_id}
                                                                    anchorEl={anchorElEmpAction[item.payroll_data_id]}
                                                                    open={Boolean(anchorElEmpAction[item.payroll_data_id])}
                                                                    onClose={(e)=>handleCloseEmpAction(item.payroll_data_id,e)}
                                                                    MenuListProps={{
                                                                    'aria-labelledby': `basic-button-${item.payroll_data_id}`,
                                                                    }}
                                                                >
                                                                    
                                                                    <MenuItem onClick={(e)=>handleEditEmpAction(item,e)} size='small'>
                                                                        <ListItemIcon color="success">
                                                                            <EditIcon color="success" fontSize="small" />
                                                                        </ListItemIcon>
                                                                        <ListItemText>Edit</ListItemText>
                                                                    </MenuItem>
                                                                    <MenuItem onClick={(e)=>handleClearPayroll(item,e)} size='small'>
                                                                        <ListItemIcon color="success">
                                                                            <ClearIcon sx={{color:orange[800]}} fontSize="small" />
                                                                        </ListItemIcon>
                                                                        <ListItemText>Clear Payroll</ListItemText>
                                                                    </MenuItem>
                                                                    <MenuItem onClick={(e)=>handleDeleteEmpAction(item,e)} size='small'>
                                                                        <ListItemIcon>
                                                                            <DeleteIcon color="error" fontSize="small" />
                                                                        </ListItemIcon>
                                                                        <ListItemText>Delete</ListItemText>
                                                                    </MenuItem>
                                                                </Menu>
                                                                </StyledTableCellSmall>
                                                            </TableRow>
                                                        )
                                                    })
                                                :
                                                <TableRow>
                                                    <TableCell colSpan={3}>No Data</TableCell>
                                                </TableRow>
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                            <Box sx={{display:'flex',alignItems:'center',mt:1,gap:1}}>
                                <Button size="small" variant="outlined" className="custom-roundbutton" onClick={handleFinalizeRecords} startIcon={<ListAltIcon color="success"/>} >Finalize Records</Button>
                                {
                                    selectedGroupDtl.status_no === 5
                                    ?
                                    <Button size="small" variant="outlined" className="custom-roundbutton" startIcon={<LockOpenIcon />} onClick={()=>setOpenMasterPassword(true)}>Unlock Records</Button>

                                    :
                                    <Button size="small" variant="outlined" className="custom-roundbutton" startIcon={<LockIcon />} onClick={handleLockRecords}>Lock Records</Button>
                                }
                            </Box>
                        </Box>
                        </Grid>
                        
                        <Grid item xs={7}>
                            <ThemeProvider theme={theme}>
                            <Paper sx={{display:'flex',flexDirection:'column',gap:2,p:2,background:grey[100]}}>
                            {/* <Typography sx={{color:blue[900],fontWeight:'bold',mb:1}}>Regular Payroll</Typography> */}
                            <Box sx={{display:'flex',gap:1}}>
                                {/* <p><strong>Employee No. :</strong><span>{selectedEmp?.emp_no}</span></p>
                                <p><strong>Employee Name :</strong><span>{selectedEmp?formatName(selectedEmp.fname,selectedEmp.mname,selectedEmp.lname,selectedEmp.extname):''} </span></p> */}
                                <TextField label='Employee No' color="primary" size="small" value = {selectedEmp?.emp_no} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}}/>

                                <TextField label='Employee Name' size="small" value = {selectedEmp?formatName(selectedEmp.fname,selectedEmp.mname,selectedEmp.lname,selectedEmp.extname):''} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth  />

                            </Box>
                            
                            {/* <p><strong>Department :</strong> <span>{selectedEmp?.dept_name}</span></p>
                            <p><strong>Position :</strong> <span>{selectedEmp?.position_name}</span></p> */}
                            
                            <TextField label='Department' size="small" value = {selectedEmp?.dept_name} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />

                            <TextField label='Position Name' size="small" value = {selectedEmp?.position_name} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />

                            <TextField label='Monthly Rate' size="small" value = {formatWithCommas(selectedEmp?.m_salary)}InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />
                            
                            <Box sx={{display:'flex',gap:1}}>
                                <Box sx={{display:'flex',gap:1,flexDirection:'row'}}>
                                <TextField label='Number of Days (15)' size="small" value = {11} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth variant="standard"/>
                                <TextField label='Number of Days (30)' size="small" value = {11} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth variant="standard"/>
                                </Box>
                                <Box sx={{display:'flex',gap:1,flexDirection:'row'}}>
                                <TextField label='Absences Day' size="small" value = {selectedEmp?.absent_days} InputLabelProps={{shrink:true}} InputProps={{readOnly:editData?false:true}} fullWidth variant="standard"/>
                                <TextField label='Absences Amount' size="small" value = {selectedEmp?.total_wopay} onChange={(val)=>setSelectedEmp({...selectedEmp,total_wopay:val.target.value})} InputLabelProps={{shrink:true}} InputProps={{readOnly:editData?false:true}} fullWidth variant="standard"/>
                                </Box>
                            </Box>

                            <TextField label='Amount Accrued' size="small" value = {formatWithCommas(selectedEmp?.amount_accrued)} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth variant="standard"/>

                            <Box sx={{display:'flex',gap:1}}>
                                <Box sx={{display:'flex',gap:1,flexDirection:'row'}}>
                                <TextField label='Rice Subsidy' size="small" value = {selectedEmp?.rice_subsidy}  onChange={(val)=>setSelectedEmp({...selectedEmp,rice_subsidy:val.target.value})}InputLabelProps={{shrink:true}} InputProps={{readOnly:editData?false:true}} fullWidth variant="standard"/>

                                <TextField label='Quarterly Allowance' size="small" value = {selectedEmp?.quarterly_allowance} onChange={(val)=>setSelectedEmp({...selectedEmp,quarterly_allowance:val.target.value})} InputLabelProps={{shrink:true}} InputProps={{readOnly:editData?false:true}} fullWidth variant="standard"/>

                                </Box>
                                <Box sx={{display:'flex',gap:1,flexDirection:'row'}}>
                                <TextField label='Subsistence Allowance' size="small" value = {selectedEmp?.subsistence_allowance} onChange={(val)=>setSelectedEmp({...selectedEmp,subsistence_allowance:val.target.value})} InputLabelProps={{shrink:true}} InputProps={{readOnly:editData?false:true}} fullWidth variant="standard"/>

                                <TextField label='Laundry Allowance' size="small" value = {selectedEmp?.laundry_allowance} onChange={(val)=>setSelectedEmp({...selectedEmp,laundry_allowance:val.target.value})} InputLabelProps={{shrink:true}} InputProps={{readOnly:editData?false:true}} fullWidth variant="standard"/>
                                </Box>
                            </Box>

                            <TextField label='PERA' size="small" value = {selectedEmp?.pera} onChange={(val)=>setSelectedEmp({...selectedEmp,pera:val.target.value})} InputLabelProps={{shrink:true}} InputProps={{readOnly:editData?false:true}} fullWidth variant="standard"/>

                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                        <Box sx={{display:'flex',gap:1,justifyContent:'space-between'}}>
                                            <TextField label='Representation' size="small" value = {formatWithCommas(selectedEmp?.representation)} onChange={(val)=>setSelectedEmp({...selectedEmp,representation:val.target.value})} InputLabelProps={{shrink:true}} InputProps={{readOnly:editData?false:true}} fullWidth variant="standard"/>

                                        <TextField label='Travelling' size="small" value = {formatWithCommas(selectedEmp?.travelling)} onChange={(val)=>setSelectedEmp({...selectedEmp,travelling:val.target.value})} InputLabelProps={{shrink:true}} InputProps={{readOnly:editData?false:true}} fullWidth variant="standard"/>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                        <Box sx={{display:'flex',gap:1,justifyContent:'space-between'}}>
                                        <TextField label='Provident (PS)' size="small" value = {formatWithCommas(selectedEmp?.provident)} onChange={(val)=>setSelectedEmp({...selectedEmp,provident:val.target.value})} InputLabelProps={{shrink:true}} InputProps={{readOnly:editData?false:true}} fullWidth variant="standard"/>

                                        <TextField label='Provident (GS)' size="small" value = '' InputLabelProps={{shrink:true}} InputProps={{readOnly:editData?false:true}} fullWidth variant="standard"/>
                                    </Box>
                                </Grid>

                                <Grid item xs={6}>
                                        <Box sx={{display:'flex',gap:1,justifyContent:'space-between'}}>
                                        <TextField label='PagIbig (PS)' size="small" value = {formatWithCommas(selectedEmp?.pagibig)} onChange={(val)=>setSelectedEmp({...selectedEmp,pagibig:val.target.value})} InputLabelProps={{shrink:true}} InputProps={{readOnly:editData?false:true}} fullWidth variant="standard"/>
                                        <TextField label='PagIbig (GS)' size="small" value = {formatWithCommas(selectedEmp?.pagibiggov)} onChange={(val)=>setSelectedEmp({...selectedEmp,pagibiggov:val.target.value})} InputLabelProps={{shrink:true}} InputProps={{readOnly:editData?false:true}} fullWidth variant="standard"/>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{display:'flex',gap:1,justifyContent:'space-between'}}>
                                        <TextField label='GSIS (PS)' size="small" value = {formatWithCommas(selectedEmp?.gsis_personal_share)} onChange={(val)=>setSelectedEmp({...selectedEmp,gsis_personal_share:val.target.value})} InputLabelProps={{shrink:true}} InputProps={{readOnly:editData?false:true}} fullWidth variant="standard"/>

                                        <TextField label='GSIS (GS)' size="small" value = {formatWithCommas(selectedEmp?.gsis_gov_share)} onChange={(val)=>setSelectedEmp({...selectedEmp,gsis_gov_share:val.target.value})} InputLabelProps={{shrink:true}}  InputProps={{readOnly:editData?false:true}} fullWidth variant="standard"/>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{display:'flex',gap:1,justifyContent:'space-between'}}>
                                        <TextField label='PHIC (PS)' size="small" value = {formatWithCommas(selectedEmp?.ph_personal_share)} onChange={(val)=>setSelectedEmp({...selectedEmp,ph_personal_share:val.target.value})} InputLabelProps={{shrink:true}} InputProps={{readOnly:editData?false:true}} fullWidth variant="standard"/>
                                        <TextField label='PHIC (GS)' size="small" value = {formatWithCommas(selectedEmp?.ph_gov_share)} onChange={(val)=>setSelectedEmp({...selectedEmp,ph_gov_share:val.target.value})} InputLabelProps={{shrink:true}} InputProps={{readOnly:editData?false:true}} fullWidth variant="standard"/>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box sx={{display:'flex',gap:1,justifyContent:'space-between'}}>
                                        <TextField label='Withholding Tax' size="small" value = {selectedEmp?.tax} onChange={(val)=>setSelectedEmp({...selectedEmp,tax:val.target.value})} InputLabelProps={{shrink:true}} InputProps={{readOnly:editData?false:true}} fullWidth variant="standard"/>
                                        <TextField label='ECC' size="small" value = {selectedEmp?.ecc} InputLabelProps={{shrink:true}} InputProps={{readOnly:editData?false:true}} fullWidth variant="standard"/>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper>
                                    <TableContainer sx={{height:200,overflow:'auto'}}>
                                        <Table stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{background:grey[300],fontSize:'.8rem'}}>
                                                        Loan Type
                                                    </TableCell>
                                                    <TableCell sx={{background:grey[300],fontSize:'.8rem'}}>
                                                    </TableCell>
                                                    <TableCell align="right" sx={{background:grey[300],fontSize:'.8rem'}}>
                                                        Amount
                                                    </TableCell>
                                                    <TableCell sx={{background:grey[300],fontSize:'.8rem'}}></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    selectedEmp&&selectedEmp.loan
                                                        ?
                                                        JSON.parse(selectedEmp.loan).map((item)=>{
                                                            return (
                                                                <TableRow key={item.emp_billing_id} hover>
                                                                    <TableCell sx={{fontSize:'.8rem'}}>
                                                                        {item.loan_abbr}
                                                                    </TableCell>
                                                                    <TableCell sx={{fontSize:'.8rem'}}>15&30</TableCell>
                                                                    <TableCell align="right" sx={{fontSize:'.8rem'}}>
                                                                        {formatWithCommas(item.amount)}
                                                                    </TableCell>
                                                                    <TableCell >
                                                                        <Button
                                                                            id={item.emp_billing_id}
                                                                            aria-controls={Boolean(item.emp_billing_id)}
                                                                            aria-haspopup="true"
                                                                            aria-expanded={Boolean(item.emp_billing_id)}
                                                                            onClick={(e)=>handleClick(item.emp_billing_id,e)}
                                                                            variant="contained"
                                                                            color="secondary"
                                                                            size="small"
                                                                            disabled={editData?false:true}

                                                                        >
                                                                            Actions
                                                                        </Button>
                                                                        <Menu
                                                                            id={item.emp_billing_id}
                                                                            anchorEl={anchorEl[item.emp_billing_id]}
                                                                            open={Boolean(anchorEl[item.emp_billing_id])}
                                                                            onClose={(e)=>handleClose(item.emp_billing_id,e)}
                                                                            MenuListProps={{
                                                                            'aria-labelledby': `basic-button-${item.emp_billing_id}`,
                                                                            }}
                                                                        >
                                                                            
                                                                            <MenuItem onClick={(e)=>handleClose(item.emp_billing_id,e)} size='small'>
                                                                                <ListItemIcon color="success">
                                                                                    <EditIcon color="success" fontSize="small" />
                                                                                </ListItemIcon>
                                                                                <ListItemText>Edit</ListItemText>
                                                                            </MenuItem>
                                                                            <MenuItem onClick={(e)=>handleDeleteLoan(item,e)} size='small'>
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
                                                        <TableCell colSpan={4} align="center">No Loan</TableCell>
                                                    </TableRow>
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <Box sx={{p:1}}>
                                        <Button startIcon={<AddIcon/>} variant="outlined" size="small" onClick={()=>setOpenManualAdd(true)} disabled={editData?false:true}>Add</Button>
                                    </Box>
                                </Paper>
                                </Grid>
                                <Grid container item xs={6} spacing={2}>
                                    <Grid item xs={12} sx={{display:'flex',flexDirection:'row',gap:1}}>
                                        <TextField label='Total Salary' size="small" value = {formatWithCommas(selectedEmp?.amount_accrued)} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth variant="standard"/>
                                        <TextField label='Total Deduction' size="small" value = {formatWithCommas(selectedEmp?.total_deductions)} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth variant="standard"/>
                                    </Grid>
                                    <Grid item xs={12} sx={{display:'flex',flexDirection:'row',gap:1}}>
                                        <TextField label='Additional Earning' size="small" value = {formatWithCommas(selectedEmp?.additional_earning)} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth variant="standard"/>
                                        <TextField label='Net Salary' size="small" value = {formatWithCommas(parseFloat(selectedEmp?.amount_15)+parseFloat(selectedEmp?.amount_30))} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth variant="standard"/>
                                    </Grid>
                                    <Grid item xs={12} sx={{display:'flex',flexDirection:'row',gap:1}}>
                                        <TextField label='15th' size="small" value = {formatWithCommas(selectedEmp?.amount_15)} InputLabelProps={{shrink:true}} InputProps={{readOnly:editData?false:true}} fullWidth variant="standard"/>
                                        <TextField label='30th' size="small" value = {formatWithCommas(selectedEmp?.amount_30)} InputLabelProps={{shrink:true}} InputProps={{readOnly:editData?false:true}} fullWidth variant="standard"/>
                                    </Grid>
                                    <Grid item xs={12} sx={{display:'flex'}}>
                                        <Grid item xs={4}>
                                            <FormControlLabel control={<Checkbox checked = {bottom.atm_15} onChange={()=>setBottom({...bottom,atm_15:!bottom.atm_15})} size='small' />} disabled={editData?false:true} label="15th ATM" />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormControlLabel control={<Checkbox checked = {bottom.atm_30} onChange={()=>setBottom({...bottom,atm_30:!bottom.atm_30})} size='small'/>} disabled={editData?false:true} label="30th ATM" />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormControlLabel control={<Checkbox checked = {bottom.add_15} onChange={()=>setBottom({...bottom,add_15:!bottom.add_15})} size='small'/>} disabled={editData?false:true} label="Add 15th" />
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControlLabel control={<Checkbox checked = {bottom.hold} onChange={()=>setBottom({...bottom,hold:!bottom.hold})} size='small' />} disabled={editData?false:true} label="HOLD" />
                                        <TextField label ='Remarks' disabled={bottom.hold?false:true} value = {bottom.hold_remarks} onChange={(val)=>setBottom({...bottom,hold_remarks:val.target.value})} multiline fullWidth/>

                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControlLabel control={<Checkbox checked = {bottom.vouchered} onChange={()=>setBottom({...bottom,vouchered:!bottom.vouchered})} size='small' />} disabled={editData?false:true} label="Vouchered Payroll" />
                                    </Grid>

                                </Grid>
                                

                                
                            </Grid>
                            <Grid item xs={12} >
                                {
                                    editData
                                    ?
                                    <Fade in>
                                    <Box sx={{display:'flex',gap:1}}>
                                    <Button variant="contained" startIcon={<CheckIcon/>} color="success" onClick = {handleSave} className="custom-roundbutton" disabled={selectedEmp?false:true}>Save</Button>
                                    <Button variant="contained" startIcon={<CloseIcon/>} color="error" onClick = {handleCancel} className="custom-roundbutton" disabled={selectedEmp?false:true}>Cancel</Button>
                                    </Box>
                                    </Fade>
                                    :
                                    // <Button variant="contained" startIcon={<EditIcon/>} color="info" onClick = {()=>setEditData(true)} className="custom-roundbutton" disabled={selectedEmp?false:true}>Edit</Button>
                                    ''

                                }
                                
                            </Grid>
                            </Paper>
                            </ThemeProvider>
                             
                        </Grid>
                        
                    </Paper>
                    
                </Grid>
        <ManualAddSelected loanType={loanType} openManualAdd = {openManualAdd} setOpenManualAdd = {setOpenManualAdd} selectedData = {selectedEmp} setSelectedEmp={setSelectedEmp} data = {data} setData = {handleUpdateData} type = 'sub' pFrom={selectedGroupDtl.period_from} pTo={selectedGroupDtl.period_to}/>
        <SmallestModal open={openMasterPassword} close = {handleCloseMasterPass} title='Input Master Password' >
            <form onSubmit={handleUnlockRecords}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <TextField label = 'Master Password' type='password' value = {masterPassword} onChange={(val)=>setMasterPassword(val.target.value)} fullWidth required/>
                    </Grid>
                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                        <Button variant="contained" className="custom-roundbutton" type="submit">Unlock</Button>
                        <Button variant="contained" className="custom-roundbutton" color="error" onClick={handleCloseMasterPass}>Cancel</Button>
                    </Grid>
                </Grid>
            </form>

        </SmallestModal>
        </Grid>
    )
}