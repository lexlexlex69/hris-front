import { Box, Button, Grid, IconButton, LinearProgress, List, ListItem, ListItemButton, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import { readExcelFiles } from '../../../customprocessdata/CustomProcessData';
import DeleteIcon from '@mui/icons-material/Delete';
import SmallModal from '../../../custommodal/SmallModal';
import LargeModal from '../../../custommodal/LargeModal';
import WifiProtectedSetupIcon from '@mui/icons-material/WifiProtectedSetup';
import { APIError, APISuccess, formatExtName, formatMiddlename, StyledTableCellLedger } from '../../../customstring/CustomString';
import FullModal from '../../../custommodal/FullModal';
import { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { blue, green, grey, orange, red } from '@mui/material/colors';
import Swal from 'sweetalert2';
import { postEmpLedger } from '../LeaveLedgerRequests';
import { APILoading } from '../../../apiresponse/APIResponse';
import Chip from '@mui/material/Chip';
import EditIcon from '@mui/icons-material/Edit';
import { PreviewLedger } from './modal/PreviewLedger';
import { BeginningBalance } from './modal/BeginningBalance';
const CustomStyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: grey[100],
        padding:5,
        // color: theme.palette.common.white,
        fontFamily:'latoreg',
        fontSize:'.6rem'
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: '.7rem',
        padding:5,
        textAlign:'center'
    },
  }));
export const DisplayEmpLedger = ({ledger,setLedger,selectedEmp,balance,setBalance,empList}) => {
    const [sheetData,setSheetData] = useState([]);
    const [sheetNames,setSheetNames] = useState([])
    const [openSelectSheet,setOpenSelectSheet] = useState(false)
    const [previewLedgerData,setPreviewLedgerData] = useState([])
    const [isLoadingData,setIsLoadingData] = useState(false)
    const [openPreviewLedger,setOpenPreviewLedger] = useState(false)
    const handleChangeFile = async (e) => {
        if(e.target.files[0]){
            let file_ext = e.target.files[0].name.split('.').pop();
            if(file_ext.toLowerCase() === 'xlsx' || file_ext.toLowerCase() === 'xls'){
                let type = 1;
                const res = await readExcelFiles(e.target.files[0],type);
                let temp_sheets = [];
                setSheetData(res.data)
                res.data.forEach((el,key)=>{
                    if(key !== 0){
                        temp_sheets.push(el.sheet_name)
                        // el.forEach((el2,key2)=>{
                        //     if(key2>=5){
                        //         console.log(el2)
                        //     }
                        // })
                    }
                })
                setSheetNames(temp_sheets)
            }
        }
    }
    const clearFile = ()=>{
        document.getElementById('excelFile').value= null;
    }
    const handleOpenSelectSheet = ()=>{
        setOpenSelectSheet(true);
    }
    const handleSelectSheet = async () => {
        try{
            const res = await processSheet();
            console.log(res.data)
            setPreviewLedgerData(res.data)
            setOpenPreviewLedger(true)
        }catch(err){
            APIError(err)
        }

        // setIsLoadingData(true)
        // let filtered = sheetData.filter(el=>el.sheet_name.toUpperCase().trim() === selectedEmp.lname.toUpperCase().trim())
        // let temp_arr = [];
        // if(filtered.length>0){
        //     filtered[0].forEach((el,key)=>{
        //         if(key>=5){
        //             // console.log(el)
        //             if(el[0]){
        //                 temp_arr.push({
        //                     inc_dates:el[0],
        //                     leave_type:el[1],
        //                     days:el[2],
        //                     hours:el[3],
        //                     mins:el[4],
        //                     vl_earned:el[6]?el[6]:0,
        //                     vl_wpay:el[7]?el[7]:0,
        //                     vl_bal:el[8]?el[8]:0,
        //                     vl_wopay:el[9]?el[9]:0,
        //                     sl_earned:el[10]?el[10]:0,
        //                     sl_wpay:el[11]?el[11]:0,
        //                     sl_bal:el[12]?el[12]:0,
        //                     sl_wopay:el[13]?el[13]:0,
        //                     action:el[14]
        //                 })
        //             }
                    
        //         }
        //     })

        // }
        // console.log(temp_arr)
        // setIsLoadingData(false)
    }
    const processSheet = () => {
        let promise = new Promise((resolve,reject) => {
            let filtered = sheetData.filter(el=>el.sheet_name.toUpperCase().trim() === selectedEmp.lname.toUpperCase().trim())
            let temp_arr = [];
            if(filtered.length>0){
                filtered[0].forEach((el,key)=>{
                    if(key>=5){
                        var t_type = 0;
                        var t_l_type = null;
                        if(typeof el[1] !== 'undefined' && typeof el[1] !== 'number'){
                            t_type = el[1]?el[1].includes('TARDI') || el[1].includes('UT') ? 4:el[1].includes('EL')?1:2:0;
                            t_l_type = el[1]?el[1]:null;
                        }
                        if(el[0]){
                            temp_arr.push({
                                type:t_type,
                                inc_dates:el[0]?el[0]:null,
                                leave_type:t_l_type,
                                days:el[2]?el[2]:0,
                                hours:el[3]?el[3]:0,
                                mins:el[4]?el[4]:0,
                                control_no:el[5]?el[5]:null,
                                vl_earned:el[6]?el[6]:0,
                                vl_wpay:el[7]?el[7]:0,
                                vl_bal:el[8]?el[8].toFixed(3):0,
                                vl_wopay:el[9]?el[9]:0,
                                sl_earned:el[10]?el[10]:0,
                                sl_wpay:el[11]?el[11]:0,
                                sl_bal:el[12]?el[12].toFixed(3):0,
                                sl_wopay:el[13]?el[13]:0,
                                action:el[14]?el[14]:null
                            })
                        }
                        
                    }
                })
            }
            if(temp_arr.length>0){
                resolve({
                    data:temp_arr
                })
            }else{
                reject(Error('No Leave Records Found in the uploaded excel file. Please check sheet name.'))
            }
        })
        return promise;
    }
    const handlePostLedger = async () =>{
        Swal.fire({
            icon:'question',
            title:'Confirm Posting Ledger?',
            text:'Please make sure that leave the ledger details is correct. Existing ledger will be override after proceeding.',
            confirmButtonText:"Yes, I confirm",
            confirmButtonColor:'green',
            cancelButtonText:"Cancel, Don't proceed",
            showCancelButton:true,
            cancelButtonColor:'red'
        }).then(async res=>{
            if(res.isConfirmed){
                try{
                    APILoading('info','Uploading Ledger','Please wait...')
                    let t_data = {
                        emp_no:selectedEmp.id_no,
                        emp_id:selectedEmp.id,
                        dept_code:selectedEmp.dept_code,
                        data:previewLedgerData,
                        vl_balance:previewLedgerData[previewLedgerData.length-1].vl_bal,
                        sl_balance:previewLedgerData[previewLedgerData.length-1].sl_bal,
                    }
                    const res = await postEmpLedger(t_data)
                    if(res.data.status === 200){
                        setOpenPreviewLedger(false)
                        APISuccess(res.data.message)
                        setLedger(res.data.data)
                        setBalance(res.data.balance)
                    }else{
                        APIError(res.data.message)
                    }
                    console.log(res.data)
                }catch(err){
                    APIError(err)
                }

            }
        })
    }
    const [openBeginBal,setOpenBeginBal] = useState(false);
    return (
        <Grid container spacing={2}>
            
            <Grid item xs={12} sx={{display:'flex',justifyContent:'space-between'}}>
                <Box sx={{display:'flex',gap:1}}>
                <Tooltip tile = 'Process Sheet of selected Employee'>
                <span>
                <Button variant='contained' onClick={handleSelectSheet} disabled={sheetNames.length>0?false:true} startIcon={<WifiProtectedSetupIcon/>} className='custom-roundbutton'>Process Sheet</Button>
                </span>
                </Tooltip>
                <Tooltip title ='Set Office/Department Beginning Balance'>
                <span>
                <Button variant='contained' color='info' className='custom-roundbutton' startIcon={<EditIcon/>} onClick={()=>setOpenBeginBal(true)} disabled={empList.length>0?false:true}>Beginning Balance</Button>
                </span>              
                </Tooltip>              

                </Box>

                <Box item xs={12} sx={{display:'flex',justifyContent:'flex-end',alignItems:'center'}}>
                    <TextField label='Upload Office Ledger' type="file" onChange={handleChangeFile} id = 'excelFile' inputProps={{accept:'.xlsx,.xls'}} InputLabelProps={{shrink:true}} size='small'/>
                    <Tooltip title='Remove Selected File'><IconButton onClick={clearFile} color='error'><DeleteIcon/></IconButton></Tooltip>
                </Box>
                
            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'space-between'}}>
                

                {
                    selectedEmp
                    ?
                    <TextField label ='Selected Employee' value={`${selectedEmp.fname} ${selectedEmp.lname}`} InputProps={{readOnly:true}} size='small'/>
                    :
                    <Typography><em>No Employee Selected</em></Typography>
                }
                {/* {
                    isLoadingData
                    ?
                    <Box sx={{width:'100%'}}>
                        <LinearProgress/>
                    </Box>
                    :
                    null
                } */}
                <Box sx={{display:'flex',gap:1,alignItems:'center'}}>
                    <Typography>Credit Balance: </Typography>
                    <Chip label={`VL (${balance.vl_bal})`} sx={{background:orange[800],color:'#fff'}}/>
                    <Chip label={`SL (${balance.sl_bal})`} sx={{background:orange[800],color:'#fff'}}/>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Paper>
                    <TableContainer sx={{maxHeight:'55dvh'}}>
                        <Table>
                            <TableHead sx={{position:'sticky',top:0,background:'#fff'}}>
                                <TableRow>
                                    <StyledTableCellLedger>
                                        Period
                                    </StyledTableCellLedger>
                                    <StyledTableCellLedger colSpan={4} align='center'>
                                        Particulars
                                    </StyledTableCellLedger>
                                        <StyledTableCellLedger rowSpan={1} align='center'>
                                        Control No.
                                    </StyledTableCellLedger>
                                    <StyledTableCellLedger colSpan={4} align='center'>
                                        Vacation Leave
                                    </StyledTableCellLedger>
                                    <StyledTableCellLedger colSpan={4} align='center'>
                                        Sick Leave
                                    </StyledTableCellLedger>
                                    <StyledTableCellLedger rowSpan={1} align='center'>
                                        Date & Action on Taken Application For Leave
                                    </StyledTableCellLedger>
                                </TableRow>
                                <TableRow>
                                    <CustomStyledTableCell align='center'>
                                        Inclusive Dates
                                    </CustomStyledTableCell>
                                    <CustomStyledTableCell align='center'>
                                        Type of Leave
                                    </CustomStyledTableCell>
                                    <CustomStyledTableCell align='center'>
                                        Days
                                    </CustomStyledTableCell>
                                    <CustomStyledTableCell align='center'>
                                        Hours
                                    </CustomStyledTableCell>
                                    <CustomStyledTableCell align='center'>
                                        Minutes
                                    </CustomStyledTableCell>
                                    <CustomStyledTableCell align='center'>
                                    </CustomStyledTableCell>
                                    <CustomStyledTableCell align='right'>
                                        Earned
                                    </CustomStyledTableCell>
                                    <CustomStyledTableCell align='right'>
                                        Absence UT/T With Pay
                                    </CustomStyledTableCell>
                                    <CustomStyledTableCell align='right'>
                                        Balance
                                    </CustomStyledTableCell>
                                    <CustomStyledTableCell align='center'>
                                        Absence UT/T Without Pay
                                    </CustomStyledTableCell>
                                    <CustomStyledTableCell align='center'>
                                        Earned
                                    </CustomStyledTableCell>
                                    <CustomStyledTableCell align='center'>
                                        Absence UT/T With Pay
                                    </CustomStyledTableCell>
                                    <CustomStyledTableCell align='right'>
                                        Balance
                                    </CustomStyledTableCell>
                                    <CustomStyledTableCell align='center'>
                                        Absence UT/T Without Pay
                                    </CustomStyledTableCell>
                                    <CustomStyledTableCell align='center'>
                                    </CustomStyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    ledger.length>0
                                    ?
                                    ledger.map((item,key)=>{
                                        return(
                                            <TableRow hover key={key}>
                                                <CustomStyledTableCell>
                                                    {item.inclusive_dates}
                                                </CustomStyledTableCell>
                                                <CustomStyledTableCell sx={{color:item.type_of_leave?item.type_of_leave.includes('TARDI')?red[800]:item.type_of_leave.includes('EL')?green[800 ]:'black':'black'}}>
                                                    {item.type_of_leave}
                                                </CustomStyledTableCell>
                                                <CustomStyledTableCell>
                                                    {item.days}
                                                </CustomStyledTableCell>
                                                <CustomStyledTableCell>
                                                    {item.hours}
                                                </CustomStyledTableCell>
                                                <CustomStyledTableCell>
                                                    {item.mins}
                                                </CustomStyledTableCell>
                                                <CustomStyledTableCell>
                                                    {item.control_no}
                                                </CustomStyledTableCell>
                                                <CustomStyledTableCell align='right'>
                                                    {item.earned_vl>0?item.earned_vl:''}
                                                </CustomStyledTableCell>
                                                <CustomStyledTableCell align='right'>
                                                    {item.absent_vl>0?item.absent_vl:''}
                                                </CustomStyledTableCell>
                                                <CustomStyledTableCell align='right'>
                                                    {item.bal_vl}
                                                </CustomStyledTableCell>
                                                <CustomStyledTableCell align='right'>
                                                    {item.absent_vl_wopay>0?item.absent_vl_wopay:''}
                                                </CustomStyledTableCell>
                                                <CustomStyledTableCell align='right'>
                                                    {item.earned_sl>0?item.earned_sl:''}
                                                </CustomStyledTableCell>
                                                <CustomStyledTableCell align='right'>
                                                    {item.absent_sl>0?item.absent_sl:''}
                                                </CustomStyledTableCell>
                                                <CustomStyledTableCell align='right'>
                                                    {item.bal_sl}
                                                </CustomStyledTableCell>
                                                <CustomStyledTableCell align='right'>
                                                    {item.absent_sl_wopay>0?item.absent_sl_wopay:''}
                                                </CustomStyledTableCell>
                                                <CustomStyledTableCell align='center'>
                                                    {item.action}
                                                </CustomStyledTableCell>
                                            </TableRow>
                                        )
                                    })
                                    :
                                    null
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
            <SmallModal open = {openSelectSheet} close = {()=>setOpenSelectSheet(false)} title='Selecting Sheet Name'>
                <Box>
                    <List sx={{maxHeight:'60dvh',overflow:'auto'}}>
                        {
                            sheetNames.map((item)=>{
                                return(
                                    <ListItemButton key={item} onClick={()=>handleSelectSheet(item)}>
                                        <ListItemText>{item}</ListItemText>
                                    </ListItemButton>
                                )
                            })
                        }
                        
                    </List>
                </Box>
            </SmallModal>
            {/* Preview Leave Ledger */}
            <FullModal open = {openPreviewLedger} close = {()=>setOpenPreviewLedger(false)} title='Previewing Ledger'>
                <PreviewLedger selectedEmp = {selectedEmp} previewLedgerData = {previewLedgerData} handlePostLedger = {handlePostLedger} CustomStyledTableCell={CustomStyledTableCell}/>
            </FullModal>
            <LargeModal open = {openBeginBal} close = {()=>setOpenBeginBal(false)} title= 'Beginning Balance'>
                <BeginningBalance empList={empList} setLedger = {setLedger} selectedEmpLedger = {selectedEmp} setBalance = {setBalance}/>
            </LargeModal>
        </Grid>
    )
}