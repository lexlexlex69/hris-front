import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography,FormControl,InputLabel,Select,MenuItem,Autocomplete, Stack, Button, Tooltip, Chip,Alert } from "@mui/material";
import React, { useState } from "react";
import { readExcelFiles } from "../../../../customprocessdata/CustomProcessData";
import Swal from "sweetalert2";
import CancelIcon from '@mui/icons-material/Cancel';
import { blue, red } from "@mui/material/colors";
import MediumModal from "../../../../custommodal/MediumModal";
import { formatExtName } from "../../../../customstring/CustomString";
import { toast } from "react-toastify";
import { postBilling } from "../BillingRequest";
import { APILoading } from "../../../../apiresponse/APIResponse";
//ICONS
import ClearIcon from '@mui/icons-material/Clear';
import { tableCellClasses } from '@mui/material/TableCell';
import {createTheme, ThemeProvider, styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[800],
        color: theme.palette.common.white,
        fontSize: 13,
        // padding:10,
        // fontFamily:'latoreg'
      
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 12,
        // padding:13,
        // fontFamily:'latoreg'
    
    },
  }));
export const PagIbig = (props)=>{
    const [data,setData] = useState([])
    const [tempData,setTempData] = useState([])
    const [file,setFile] = useState(null)
    const [sheets,setSheets] = useState([])
    const [hasError,setHasError] = useState(false)
    const [emptyIDData,setEmptyIDData] = useState([])
    const [emptyAmountData,setEmptyAmountData] = useState([])
    const [periodFrom,setPeriodFrom] = useState('')
    const [periodTo,setPeriodTo] = useState('')
    const [periodYear,setPeriodYear] = useState('')
    
    const handleChangeFile = async (e)=>{
        if(e.target.files[0]){
            setData([])
            setHasError(false)
            let type = 1;
            const res = await readExcelFiles(e.target.files[0],type);
            setTempData(res.data)
            var temp_sheets = []
            res.sheets.forEach((el,key)=>{
                temp_sheets.push({
                    sheet_name:el,
                    index:key,
                    loan_dtl: {
                        loan_code:'',
                        loan_desc: '',
                        abbr_name:'',
                        type:''
                    }
                })
                
            })
            setSheets(temp_sheets)
        }else{
            setSheets([])
            setData([])
            setEmptyIDData([])
            setEmptyAmountData([])
            setHasError(false)
        }
        
        // let list = [];
        
        // if(type === 0){
        //     var amort_index = null;
        //     res.data.forEach((el,key) => {
        //         if(key === 0){
        //             /**
        //             Get index of amort
        //             */
        //             amort_index = el.indexOf('AMORT.');
        //         }
        //         if(key !==0 && el[1]){
        //             if(amort_index < 0){
        //                 Swal.fire({
        //                     icon:'error',
        //                     title:'Oops...',
        //                     text:'No Amort. Column Found On Sheet!'
        //                 })
        //                 return 0;
        //             }else{
        //                 list.push({
        //                     lname:el[1],
        //                     fname:el[2],
        //                     mname:el[3],
        //                     extname:el[4],
        //                     id:el[0],
        //                     loantype:el[7],
        //                     amort:el[amort_index]
        //                 })
        //             }
                    
        //         }
                
        //     });
        // }else{
        //     var sheets = [];
        //     console.log(res)
        //     /**
        //      * Check if required column is found
        //      */
        //     var complete = false;
        //     var c_amort_index = null;
        //     var c_loantype_index = null;
        //     var sheet = null;

        //     res.data.every((el,key2) => {
        //         el.every((el2,key)=>{
        //             if(key === 0){
        //                 /**
        //                 Get index of amort
        //                 */
        //                 c_amort_index = el2.indexOf('AMORT.');
        //                 c_loantype_index = el2.indexOf('LOANTYPE');
        //                 if(c_amort_index > 0 && c_loantype_index > 0){
        //                     complete = true;
        //                 }else{
        //                     complete = false;
        //                     sheet = res.sheets[key2];
        //                 }
        //             }
                    
        //         })
        //         if(complete){
        //             return true;
        //         }else{
        //             return false;
        //         }
        //     })
        //     if(complete){
        //         var temp_sheets = []
        //         res.sheets.forEach((el,key)=>{
        //             temp_sheets.push({
        //                 sheet_name:el,
        //                 index:key,
        //                 loan_dtl: {
        //                     loan_code:'',
        //                     loan_desc: '',
        //                     abbr_name:'',
        //                     type:''
        //                 }
        //             })
                    
        //         })
        //         setSheets(temp_sheets)

        //         var amort_index = null;
        //         var loantype_index = null;
        //         res.data.forEach((el,key2) => {
        //             el.forEach((el2,key)=>{
        //                 if(key === 0){
        //                     /**
        //                     Get index of amort
        //                     */
        //                     amort_index = el2.indexOf('AMORT.');
        //                     loantype_index = el2.indexOf('LOANTYPE');
        //                 }
                        
        //                 if(key !==0 && el2[1]){
        //                     list.push({
        //                         lname:el2[1],
        //                         fname:el2[2],
        //                         mname:el2[3],
        //                         extname:el2[4],
        //                         id:el2[0],
        //                         loantype:el2[loantype_index],
        //                         amort:el2[amort_index]
        //                     })
        //                 }
                        
        //             })
        //         })
        //         setTempData(list)
        //         // setData(list)
        //         // console.log(list)
        //         Swal.close();
        //     }else{
        //         Swal.fire({
        //             icon:'error',
        //             title:'Oops...',
        //             text:'AMORT. or LOANTYPE column not found in Sheet: '+sheet
        //         })
        //     }
            
            
        // }

        
    }
    const handleChange = (index,val)=>{
        let temp = [...sheets];
        if(val){
            temp[index].loan_dtl = val;
        }
        setSheets(temp)
    }
    const handleProceed = ()=>{
        // const id = toast.loading('Checking data');

        let new_arr = [];
        let temp = [...tempData]
        /**
        Check if all sheets has assign loan type
         */
        console.log(sheets)
        var empty_assign = sheets.filter(el=>!el.loan_dtl.loan_code)
        var empty_sheet='';
        var empty_column='';
        if(empty_assign.length>0){
            empty_assign.forEach((el,key)=>{
                if(key===0){
                    if(key === empty_assign.length-1){
                        empty_sheet+=el.sheet_name
                    }else{
                        empty_sheet+=el.sheet_name+', '
                    }
                }else if(key === empty_assign.length-1){
                    empty_sheet+=el.sheet_name
                }else{
                    empty_sheet+=el.sheet_name+', '
                }
            })
            
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                text:empty_sheet+' sheet was not assigned to a loan type! Please check again.'
            })
        }else{
            sheets.forEach(el=>{
                temp[el.index].loan_code = el.loan_dtl.loan_code;
                temp[el.index].loan_desc = el.loan_dtl.loan_desc;
                temp[el.index].abbr_name = el.loan_dtl.abbr_name;
                new_arr.push(temp[el.index])
            })
            /**
            * Check if required column is found
            */
            var complete = false;
            var sheet;
            console.log(new_arr)
            sheets.every((el,index)=>{
                switch(el.loan_dtl.loan_code){
                    //PAG-IBIG MULTI PURPOSE LOAN
                    case "9":
                        var c_amort_index = null;
                        var c_loantype_index = null;
                        new_arr[index].every((el2,key)=>{
                            if(key === 0){
                                /**
                                Get index of amort
                                */
                                c_amort_index = el2.indexOf('AMORT.');
                                c_loantype_index = el2.indexOf('LOANTYPE');
                                // if(c_amort_index > 0 && c_loantype_index > 0){
                                if(c_amort_index > 0){
                                    complete = true;
                                }else{
                                    complete = false;
                                    empty_column = 'AMORT.';
                                    sheet=el.sheet_name
                                }
                            }
                            if(complete){
                                return true;
                            }else{
                                return false;
                            }
                        })
                        return complete;
                    break;
                    //PAG-IBIG CALAMITY LOAN
                    case "2":
                        var c_amort_index = null;
                        var c_loantype_index = null;
                        new_arr[index].every((el2,key)=>{
                            if(key === 0){
                                /**
                                Get index of amort
                                */
                                c_amort_index = el2.indexOf('AMORT.');
                                c_loantype_index = el2.indexOf('LOANTYPE');
                                // if(c_amort_index > 0 && c_loantype_index > 0){
                                if(c_amort_index > 0){
                                    complete = true;
                                }else{
                                    complete = false;
                                    empty_column = 'AMORT.';
                                    sheet=el.sheet_name
                                }
                            }
                            if(complete){
                                return true;
                            }else{
                                return false;
                            }
                        })
                        return complete;
                    break;
                    //PROVIDENT REGULAR LOAN I,REGULAR LOAN II
                    case "42":case"63":
                        var c_amount_index = null;
                        new_arr[index].every((el2,key)=>{
                            if(key === 0){
                                /**
                                Get index of amort
                                */
                                c_amount_index = el2.indexOf('AMOUNT');
                                console.log(c_amount_index);
                                if(c_amount_index > 0){
                                    complete = true;
                                }else{
                                    complete = false;
                                    empty_column = 'AMOUNT';
                                    sheet=el.sheet_name
                                }
                            }
                            if(complete){
                                return true;
                            }else{
                                return false;
                            }
                        })
                        return complete;
                    break;
                    //PAG-IBIG HOUSING LOAN
                    case "10":
                        var c_amount_index = null;
                        new_arr[index].every((el2,key)=>{
                            if(key === 0){
                                /**
                                Get index of amort
                                */
                                c_amount_index = el2.indexOf('AMOUNT');
                                console.log(c_amount_index);
                                if(c_amount_index > 0){
                                    complete = true;
                                }else{
                                    complete = false;
                                    empty_column = 'AMOUNT';
                                    sheet=el.sheet_name
                                }
                            }
                            if(complete){
                                return true;
                            }else{
                                return false;
                            }
                        })
                        return complete;
                    break;
                    //PAG-IBIG MP2
                    case "58":
                        var c_amount_index = null;
                        new_arr[index].every((el2,key)=>{
                            if(key === 0){
                                /**
                                Get index of amort
                                */
                                c_amount_index = el2.indexOf('EE SHARE');
                                console.log(c_amount_index);
                                if(c_amount_index > 0){
                                    complete = true;
                                }else{
                                    complete = false;
                                    empty_column = 'EE SHARE';
                                    sheet=el.sheet_name
                                }
                            }
                            if(complete){
                                return true;
                            }else{
                                return false;
                            }
                        })
                        return complete;
                    break;

                }
            })
            if(complete){
                // var temp_sheets = []
                // res.sheets.forEach((el,key)=>{
                //     temp_sheets.push({
                //         sheet_name:el,
                //         index:key,
                //         loan_dtl: {
                //             loan_code:'',
                //             loan_desc: '',
                //             abbr_name:'',
                //             type:''
                //         }
                //     })
                    
                // })
                // setSheets(temp_sheets)

                var amount_index = null;
                var loantype_index = null;
                var list = [];
                new_arr.forEach((el,key2) => {
                    el.forEach((el2,key)=>{
                        if(key === 0){
                            switch(el.loan_code){
                                //PAGIBIG MPL,CAL
                                case "9":case "2":
                                /**
                                Get index of amort
                                */
                                amount_index = el2.indexOf('AMORT.');
                                // loantype_index = el2.indexOf('LOANTYPE');
                                break;
                                //PROVIDENT LOAN 1, LOAN 2
                                case "42":case"63":
                                amount_index = el2.indexOf('AMOUNT');
                                break;
                                case "10":
                                amount_index = el2.indexOf('AMOUNT');
                                break;
                                case "58":
                                amount_index = el2.indexOf('EE SHARE');
                                break;
                            }
                        }
                        if(key !==0 && el2[1]){
                            switch(el.loan_code){
                                case "9":case "2":
                                list.push({
                                    lname:el2[1],
                                    fname:el2[2],
                                    mname:el2[3],
                                    extname:el2[4],
                                    id:el2[0],
                                    loantype:el.abbr_name,
                                    amount:el2[amount_index],
                                    loancode:el.loan_code,
                                    loanname:el.loan_desc,
                                })
                                break;
                                case "42":case "63":
                                list.push({
                                    lname:el2[1],
                                    fname:el2[2],
                                    mname:el2[3],
                                    extname:el2[4],
                                    id:el2[0],
                                    loantype:el.abbr_name,
                                    amount:el2[amount_index],
                                    loancode:el.loan_code,
                                    loanname:el.loan_desc,
                                })
                                break;
                                case "10":
                                list.push({
                                    lname:el2[2],
                                    fname:el2[3],
                                    mname:el2[5],
                                    extname:el2[4],
                                    id:el2[0],
                                    loantype:el.abbr_name,
                                    amount:el2[amount_index],
                                    loancode:el.loan_code,
                                    loanname:el.loan_desc,
                                })
                                break;
                                case "58":
                                list.push({
                                    lname:el2[3],
                                    fname:el2[4],
                                    mname:el2[6],
                                    extname:el2[5],
                                    id:el2[0],
                                    loantype:el.abbr_name,
                                    amount:el2[amount_index],
                                    loancode:el.loan_code,
                                    loanname:el.loan_desc,
                                })
                                break;
                            }
                            
                        }
                        
                    })
                })
                console.log(list)
                /**
                Check if id,amount is null
                */
                var empty_id = list.filter(el=>!el.id);
                var empty_amount = list.filter(el=>!el.amount);
                if(empty_id.length>0 || empty_amount.length>0){
                    setHasError(true)
                    setEmptyIDData(empty_id)
                    setEmptyAmountData(empty_amount)
                }else{
                    setHasError(false)
                }
                setData(list)
                // toast.update(id,{
                //     render:'Done',
                //     type:'success',
                //     autoClose:true,
                //     isLoading:false
                // })
            }else{
                Swal.fire({
                    icon:'error',
                    title:'Oops...',
                    html:empty_column+' column is missing in sheet: '+sheet
                })
            }
            
        }
        
    }
    const handleRemoveSheet = (index) =>{
        let temp = [...sheets];
        temp.splice(index,1);
        setSheets(temp)
    }
    const [openError,setOpenError] = useState(false)
    const [errorType,setErrorType] = useState('')
    const handleShowData = (type)=>{
        console.log(emptyAmountData)
        setErrorType(type)
        setOpenError(true)
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        APILoading('info','Uploading data','Please wait')
        try{
            var t_data = {
                data:data.filter(el=>el.id && el.amount?el.amount>0:el.amount),
                period_from:periodFrom,
                period_to:periodTo,
                period_year:periodYear
            }
            const res = await postBilling(t_data);
            if(res.data.status === 200){
                Swal.fire({
                    icon:'success',
                    title:res.data.message
                })
            }else{
                 Swal.fire({
                    icon:'warning',
                    title:res.data.message
                })
            }
        }catch(error){
            Swal.fire({
                icon:'error',
                title:error
            })
        }
    }
    const handleClearFile = () => {
        setSheets([])
        setData([])
        setEmptyIDData([])
        setEmptyAmountData([])
        setHasError(false)
        document.getElementById('excelFile').value= null;
    }
    return(
        <Box>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography sx={{color:''}}>{props.title}</Typography>
                </Grid>
                <Grid item xs={12} sx={{display:'flex',gap:1}}>
                    <TextField type="file" onChange={handleChangeFile} id = 'excelFile'/>
                    <Button startIcon={<ClearIcon/>} color='error' variant="outlined" sx={{height:'100%'}} onClick={handleClearFile}>Remove File</Button>
                </Grid>
                    {
                        sheets&&sheets.length>0
                        ?
                            <Grid item xs={12}>
                            <Alert severity="info">Please assign loan type on every sheet name uploaded.</Alert>
                            <Typography sx={{textAlign:'center',color:blue[600],fontSize:'1.1rem'}}>Available Sheet/s:</Typography>
                            <Box sx={{display:'flex',justifyContent:'space-evenly',gap:1,mt:1}}>
                            {
                                sheets.map((item,key)=>{
                                    return(
                                        <Box sx={{display:'flex',flexDirection:'row'}}>
                                        <Autocomplete
                                            disablePortal
                                            id={"combo-box-loantype-"+key}
                                            options={props.loanType}
                                            getOptionLabel={(option) => option.loan_desc}
                                            sx={{ width: 250}}
                                            value = {item.loan_dtl}
                                            onChange={(event, newValue) => {
                                                handleChange(key,newValue);
                                            }}
                                            renderInput={(params) => <TextField {...params} label={`${item.sheet_name}`}/>}
                                        />
                                        <Tooltip title={`Remove ${item.sheet_name} sheet`}><Button color='error' onClick={()=>handleRemoveSheet(key)}><CancelIcon/></Button></Tooltip>
                                        </Box>
                                        
                                    )
                                })
                            }
                            <Button variant="contained" onClick={handleProceed} disabled={sheets.length>0?false:true}>Proceed</Button>
                            </Box>
                            </Grid>
                            
                        :
                        null
                    }
                {
                    data.length>0
                    ?
                    (
                        <Grid item xs={12}>
                            <Paper>
                                <TableContainer sx={{maxHeight:'60vh'}}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell>
                                                    ID No.
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    Surname
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    First Name
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    Middle Name
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    Ext Name
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    Loan Type
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    Amount
                                                </StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                data.map((item,key)=>{
                                                    return(
                                                        <TableRow key = {key} sx={{background:!item.id || !item.amount ?red[800]:'auto'}}>
                                                            <TableCell>
                                                                {item.id}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.lname}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.fname}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.mname}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.extname}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.loantype}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.amount}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    )
                    :
                    null
                }
                
                
                {
                    hasError
                    ?
                    (<Grid item xs={12}>
                        <Paper>
                            <Box  sx={{p:1}}>
                                <Typography color='error' sx={{fontWeight:'bold'}}>Error Details</Typography>
                                <Stack direction="row" spacing={1}>
                                {
                                    emptyIDData&&emptyIDData.length>0
                                    ?
                                    (
                                    <Chip label={`Total No ID: ${emptyIDData.length}`} variant="outlined" onClick={()=>handleShowData(1)}/>

                                    )
                                    :
                                    null
                                }
                                {
                                    emptyAmountData&&emptyAmountData.length>0
                                    ?
                                    (
                                        <Chip label={`Total No Amount: ${emptyAmountData.length}`} variant="outlined" onClick={()=>handleShowData(2)}/>
                                    )
                                    :
                                    null
                                }
                                </Stack>
                            <MediumModal open = {openError} close = {()=>setOpenError(false)} title='Error Details'>
                                {
                                    errorType === 1
                                    ?
                                    (
                                        <Box>
                                            <Typography>NO ID's:</Typography>
                                            <Paper>
                                            <TableContainer sx={{maxHeight:'70vh'}}>
                                                <Table stickyHeader>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>
                                                            Name
                                                        </TableCell>
                                                        <TableCell>
                                                            Loan Type
                                                        </TableCell>
                                                        <TableCell>
                                                            Amount
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {emptyIDData.map((item,key)=>{
                                                        return(
                                                            <TableRow key={key}>
                                                                <TableCell>
                                                                    {item.fname} {item.mname} {item.lname} {formatExtName(item.extname)}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.loantype}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.amount}
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })
                                                    }
                                                </TableBody>
                                                </Table>
                                            </TableContainer>
                                            </Paper>
                                            
                                            
                                        </Box>
                                    )
                                    :
                                    (
                                        <Box>
                                            <Typography>NO Amount's:</Typography>
                                            <Paper>
                                            <TableContainer sx={{maxHeight:'70vh'}}>
                                                <Table stickyHeader>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>
                                                            Name
                                                        </TableCell>
                                                        <TableCell>
                                                            Loan Type
                                                        </TableCell>
                                                        <TableCell>
                                                            ID
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {emptyAmountData.map((item,key)=>{
                                                        return(
                                                            <TableRow key={key}>
                                                                <TableCell>
                                                                    {item.fname} {item.mname} {item.lname} {formatExtName(item.extname)}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.loantype}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.id}
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })
                                                    }
                                                </TableBody>
                                                </Table>
                                            </TableContainer>
                                            </Paper>
                                            
                                            
                                        </Box>
                                    )

                                }
                            </MediumModal>
                            </Box>
                        </Paper>
                    </Grid>)

                    :
                    null
                }
                {
                    data.length>0
                    ?
                    (<form onSubmit={handleSubmit} style={{width:'100%'}}>
                        <Grid item xs={12} sx={{mt:2,display:'flex',gap:1,justifyContent:'center',alignItems:'center'}}>
                            <TextField type='date' label='Period From' InputLabelProps={{shrink:true}} value={periodFrom} onChange = {(val)=>setPeriodFrom(val.target.value)} required/>
                            <TextField type='date' label='Period To' InputLabelProps={{shrink:true}} value={periodTo} onChange = {(val)=>setPeriodTo(val.target.value)} required/>
                            <TextField type='text' label='Year' InputLabelProps={{shrink:true}} value={periodYear} onChange = {(val)=>setPeriodYear(val.target.value)} required/>
                            <Button variant="contained" type="submit" sx={{height:'100%'}}>Submit</Button>
                        </Grid>
                    </form>)
                    :
                    null
                }
                
            </Grid>
        </Box>
    )
}