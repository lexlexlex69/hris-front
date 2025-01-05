import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography,FormControl,InputLabel,Select,MenuItem,Autocomplete, Stack, Button, Tooltip, Chip,Alert, TableFooter } from "@mui/material";
import React, { useState } from "react";
import { readExcelFiles, sortString } from "../../../../customprocessdata/CustomProcessData";
import Swal from "sweetalert2";
import { blue, red } from "@mui/material/colors";
import MediumModal from "../../../../custommodal/MediumModal";
import { APIError, APISuccess, formatExtName, formatFullname, formatMiddlename, formatName } from "../../../../customstring/CustomString";
import { toast } from "react-toastify";
import { postBilling, updateEmpBillingID } from "../BillingRequest";
import { APILoading } from "../../../../apiresponse/APIResponse";
//ICONS
import {Clear as ClearIcon, Edit as EditIcon, Cancel as CancelIcon, PersonRemove as PersonRemoveIcon} from '@mui/icons-material';
import { tableCellClasses } from '@mui/material/TableCell';
import {createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { Period } from "./Period";
import '.././Billing.css';
import { ManualAdd } from "./ManualAdd";
import moment from "moment";
import LargeModal from "../../../../custommodal/LargeModal";
import SearchEmpModal from "../../../../custommodal/SearchEmpModal";
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
export const UploadBilling = (props)=>{
    const [data,setData] = useState([])
    const [tempData,setTempData] = useState([])
    const [file,setFile] = useState(null)
    const [sheets,setSheets] = useState([])
    const [hasError,setHasError] = useState(false)
    const [emptyIDData,setEmptyIDData] = useState([])
    const [emptyAmountData,setEmptyAmountData] = useState([])
    const [periodFrom,setPeriodFrom] = useState('')
    const [periodTo,setPeriodTo] = useState('')
    const [periodYear,setPeriodYear] = useState(moment().format('YYYY'))
    const [openErrorUpload,setOpenErrorUpload] = useState(false);
    const [errorUploadData,setErrorUploadData] = useState([]);

    console.log(props)

    const handleChangeFile = async (e)=>{
        if(e.target.files[0]){
            let file_ext = e.target.files[0].name.split('.').pop();
            if(file_ext.toLowerCase() === 'xlsx' || file_ext.toLowerCase() === 'xls'){
                setData([])
                setHasError(false)
                let type = 1;
                const res = await readExcelFiles(e.target.files[0],type);
                setTempData(res.data)
                var temp_sheets = []
                res.sheets.forEach((el,key)=>{
                    //set loan dtl based on sheet name
                    var l_dtl = props.loanType.filter(el2=>el2.loan_desc.includes(el))
                    console.log(l_dtl)
                    temp_sheets.push({
                        sheet_name:el,
                        index:key,
                        // loan_dtl: {
                        //     loan_code:'',
                        //     loan_desc: '',
                        //     abbr_name:'',
                        //     type:''
                        // }
                        loan_dtl:l_dtl.length>0?l_dtl[0]:{
                            loan_code:'',
                            loan_desc: '',
                            abbr_name:'',
                            type:''
                        }
                    })
                    
                })
                setSheets(temp_sheets)
            }else{
                toast.warning('Please upload Excel File !')
            }
            
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
                switch(String(el.loan_dtl.loan_code)){
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
                            switch(String(el.loan_code)){
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
                            switch(String(el.loan_code)){
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
                                    lname:el2[1],
                                    fname:el2[2],
                                    mname:el2[4],
                                    extname:el2[3],
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
                var empty_amount = list.filter(el=> !el.amount || typeof el.amount !== 'number');
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
    const handleSubmit = async (from,to,year) => {
        APILoading('info','Uploading billing','Please wait')
        try{
            var temp_data;
            console.log(fileType)
            switch(Number(fileType)){
                case 1:
                    temp_data = data.filter(el=>el.id && el.amount && el.amount>0 && typeof el.amount === 'number')
                break;
                case 2: case 3:
                    temp_data = data2.filter(el=>el.id &&el.amount && el.amount>0)
                break;
            }
            console.log(temp_data)
            var t_data = {
                data:temp_data,
                period_from:from,
                period_to:to,
                period_year:year
            }
            const res = await postBilling(t_data);
            if(res.data.status === 200){
                var html = '';
                if(res.data.no_emp_no.length>0){
                    setErrorUploadData(res.data.no_emp_no)
                    setOpenErrorUpload(true)
                    // html+='<div id="billing"><table class="table table-bordered table-html" ><thead><tr><th>ID</th><th>Name</th><th>Remarks</th></tr></thead><tbody>';
                    // res.data.no_emp_no.forEach(el => {
                    //     html+='<tr><td>'+el.id+'</td>'+'<td>'+`${el.lname}, ${el.fname} ${formatMiddlename(el.mname)}`+'</td><td>'+el.remarks+'</td></tr>';
                    // });
                    // html+='</tbody></table></div>';
                }
                // Swal.fire({
                //     icon:'success',
                //     title:res.data.message,
                //     html:html
                // })
                Swal.close();
            }else{
                 Swal.fire({
                    icon:'warning',
                    title:res.data.message
                })
                if(res.data.no_emp_no.length>0){
                    setErrorUploadData(res.data.no_emp_no)
                    setOpenErrorUpload(true)
                }
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
        setData2([])
        setEmptyIDData([])
        setEmptyAmountData([])
        setHasError(false)
        document.getElementById('excelFile').value= null;
    }
    const [fileType,setFileType] = useState(1)
    const handleChangeFileType = (val)=>{
        setFileType(val.target.value)
    }
    const [notDefaultData,setNotDefaultData] = useState([])
    const [data2,setData2] = useState([])
    const handleProceedNotDefault = ()=>{
        console.log(tempData)
        let list = [];
        let list2 = [];
        let empty_id = [];
        console.log(fileType)
        switch(Number(fileType)){
            //GSIS NEW
            case 2:
                tempData.forEach(el=>{
                    var CONSOLOAN = 0;
                    var ECARDPLUS = 0;
                    var SALARY_LOAN = 0;
                    var CASH_ADV = 0;
                    var EMRGYLN = 0;
                    var EDUC_ASST = 0;
                    var ELA = 0;
                    var SOS = 0;
                    var PLREG = 0;
                    var PLOPT = 0;
                    var REL = 0;
                    var LCH_DCS = 0;
                    var STOCK_PURCHASE = 0;
                    var OPT_LIFE = 0;
                    var CEAP = 0;
                    var EDU_CHILD = 0;
                    var GENESIS = 0;
                    var GENPLUS = 0;
                    var GENFLEXI = 0;
                    var GENSPCL = 0;
                    var GFAL = 0;
                    var MPL = 0;
                    var CPL = 0;
                    var GEL = 0;
                    
                    el.forEach((el2,key)=>{
                        if(key === 0){
                            CONSOLOAN = el2.indexOf('CONSOLOAN')
                            ECARDPLUS = el2.indexOf('ECARDPLUS')
                            SALARY_LOAN = el2.indexOf('SALARY_LOAN')
                            CASH_ADV = el2.indexOf('CASH_ADV')
                            EMRGYLN = el2.indexOf('EMRGYLN')
                            EDUC_ASST = el2.indexOf('EDUC_ASST')
                            ELA = el2.indexOf('ELA')
                            SOS = el2.indexOf('SOS')
                            PLREG = el2.indexOf('PLREG')
                            PLOPT = el2.indexOf('PLOPT')
                            REL = el2.indexOf('REL')
                            LCH_DCS = el2.indexOf('LCH_DCS')
                            STOCK_PURCHASE = el2.indexOf('STOCK_PURCHASE')
                            OPT_LIFE = el2.indexOf('OPT_LIFE')
                            CEAP = el2.indexOf('CEAP')
                            EDU_CHILD = el2.indexOf('EDU_CHILD')
                            GENESIS = el2.indexOf('GENESIS')
                            GENPLUS = el2.indexOf('GENPLUS')
                            GENFLEXI = el2.indexOf('GENFLEXI')
                            GENSPCL = el2.indexOf('GENSPCL')
                            GFAL = el2.indexOf('GFAL')
                            MPL = el2.indexOf('MPL')
                            CPL = el2.indexOf('CPL')
                            GEL = el2.indexOf('GEL')
                        }
                        if(key !==0){
                                if(el2[0]){
                                    // list.push({
                                    //     id:el2[0],
                                    //     lname:el2[1],
                                    //     fname:el2[2],
                                    //     mname:el2[3],
                                    //     extname:el2[5],
                                    //     "CONSOLOAN":el2[13],
                                    //     "ECARDPLUS":el2[14],
                                    //     "SALARY_LOAN":el2[15],
                                    //     "CASH_ADV":el2[16],
                                    //     "EMRGYLN":el2[17],
                                    //     "EDUC_ASST":el2[18],
                                    //     "ELA":el2[19],
                                    //     "SOS":el2[20],
                                    //     "PLREG":PLREG>0?el2[PLREG]:0,
                                    //     "PLOPT":el2[22],
                                    //     "REL":el2[23],
                                    //     "LCH_DCS":el2[24],
                                    //     "STOCK_PURCHASE":el2[25],
                                    //     "OPT_LIFE":el2[26],
                                    //     "CEAP":el2[27],
                                    //     "EDU_CHILD":el2[28],
                                    //     "GENESIS":el2[29],
                                    //     "GENPLUS":el2[30],
                                    //     "GENFLEXI":el2[31],
                                    //     "GENSPCL":el2[32],
                                    //     "HELP":el2[33],
                                    //     "GFAL":el2[34],
                                    //     "MPL":el2[35],
                                    //     "CPL":el2[36],
                                    //     "GEL":el2[37]
                                    // })
                                    if(el2[CONSOLOAN]>0){
                                        list2.push({
                                            id:el2[0],
                                            lname:el2[1],
                                            fname:el2[2],
                                            mname:el2[3],
                                            extname:el2[5],
                                            loantype:"CONSOLOAN",
                                            amount:el2[CONSOLOAN],
                                            loancode:"3",
                                            loanname:'GSIS CONSOLIDATED LOAN',
                                        })
                                    }
                                    if(el2[ECARDPLUS]>0){
                                        list2.push({
                                            id:el2[0],
                                            lname:el2[1],
                                            fname:el2[2],
                                            mname:el2[3],
                                            extname:el2[5],
                                            loantype:"E-CARD OLD",
                                            amount:el2[ECARDPLUS],
                                            loancode:"37",
                                            loanname:'GSIS E-CARD PLUS - OLD ACCOUNTS',
                                        })
                                    }
                                    if(el2[SALARY_LOAN]>0){
                                        list2.push({
                                            id:el2[0],
                                            lname:el2[1],
                                            fname:el2[2],
                                            mname:el2[3],
                                            extname:el2[5],
                                            loantype:"ESL OLD",
                                            amount:el2[SALARY_LOAN],
                                            loancode:"16",
                                            loanname:'GSIS ENHANCED SALARY LOAN - OLD',
                                        })
                                    }
                                    if(el2[CASH_ADV]>0){
                                        list2.push({
                                            id:el2[0],
                                            lname:el2[1],
                                            fname:el2[2],
                                            mname:el2[3],
                                            extname:el2[5],
                                            loantype:"CASH ADVANCE",
                                            amount:el2[CASH_ADV],
                                            loancode:"46",
                                            loanname:'GSIS CASH ADVANCE - OLD ACCOUNT',
                                        })
                                    }
                                    if(el2[EMRGYLN]>0){
                                        list2.push({
                                            id:el2[0],
                                            lname:el2[1],
                                            fname:el2[2],
                                            mname:el2[3],
                                            extname:el2[5],
                                            loantype:"EMRGYLN",
                                            amount:el2[EMRGYLN],
                                            loancode:"7",
                                            loanname:'GSIS EMERGENCY LOAN',
                                        })
                                    }
                                    if(el2[EDUC_ASST]>0){
                                        list2.push({
                                            id:el2[0],
                                            lname:el2[1],
                                            fname:el2[2],
                                            mname:el2[3],
                                            extname:el2[5],
                                            loantype:"EDUC_ ASST",
                                            amount:el2[EDUC_ASST],
                                            loancode:"6",
                                            loanname:'GSIS EDUC ASSISTANCE',
                                        })
                                    }
                                    // if(el2[19]>0){
                                    //     list2.push({
                                    //         id:el2[0],
                                    //         lname:el2[1],
                                    //         fname:el2[2],
                                    //         mname:el2[3],
                                    //         extname:el2[5],
                                    //         loantype:"EDUC_ASST OLD",
                                    //         amount:el2[amount_index],
                                    //         loancode:"34",
                                    //         loanname:'GSIS EDUC ASSISTANCE - OLD ACCOUNTS',
                                    //     })
                                    // }
                                    if(el2[SOS]>0){
                                        list2.push({
                                            id:el2[0],
                                            lname:el2[1],
                                            fname:el2[2],
                                            mname:el2[3],
                                            extname:el2[5],
                                            loantype:"SOS OLD",
                                            amount:el2[SOS],
                                            loancode:"38",
                                            loanname:'GSIS SOS LOAN - OLD',
                                        })
                                    }
                                    if(el2[PLREG]>0){
                                        list2.push({
                                            id:el2[0],
                                            lname:el2[1],
                                            fname:el2[2],
                                            mname:el2[3],
                                            extname:el2[5],
                                            loantype:"PLRG",
                                            amount:el2[PLREG],
                                            loancode:"28",
                                            loanname:'GSIS POLICY LOAN REGULAR',
                                        })
                                    }
                                    if(el2[PLOPT]>0){
                                        list2.push({
                                            id:el2[0],
                                            lname:el2[1],
                                            fname:el2[2],
                                            mname:el2[3],
                                            extname:el2[5],
                                            loantype:"PLOPT",
                                            amount:el2[PLOPT],
                                            loancode:"29",
                                            loanname:'GSIS POLICY LOAN OPTIONAL',
                                        })
                                    }
                                    if(el2[REL]>0){
                                        list2.push({
                                            id:el2[0],
                                            lname:el2[1],
                                            fname:el2[2],
                                            mname:el2[3],
                                            extname:el2[5],
                                            loantype:"REL",
                                            amount:el2[REL],
                                            loancode:"54",
                                            loanname:'GSIS REAL ESTATE LOAN',
                                        })
                                    }
                                    if(el2[OPT_LIFE]>0){
                                        list2.push({
                                            id:el2[0],
                                            lname:el2[1],
                                            fname:el2[2],
                                            mname:el2[3],
                                            extname:el2[5],
                                            loantype:"OPT_LIFE",
                                            amount:el2[OPT_LIFE],
                                            loancode:"61",
                                            loanname:'GSIS UOLI PREMIUM',
                                        })
                                    }
                                    if(el2[CEAP]>0){
                                        list2.push({
                                            id:el2[0],
                                            lname:el2[1],
                                            fname:el2[2],
                                            mname:el2[3],
                                            extname:el2[5],
                                            loantype:"GSIS CEAP",
                                            amount:el2[CEAP],
                                            loancode:"60",
                                            loanname:'GSIS CEAP',
                                        })
                                    }
                                    if(el2[GFAL]>0){
                                        list2.push({
                                            id:el2[0],
                                            lname:el2[1],
                                            fname:el2[2],
                                            mname:el2[3],
                                            extname:el2[5],
                                            loantype:"GSIS GFAL",
                                            amount:el2[GFAL],
                                            loancode:"72",
                                            loanname:'GSIS GFAL',
                                        })
                                    }
                                    if(el2[MPL]>0){
                                        list2.push({
                                            id:el2[0],
                                            lname:el2[1],
                                            fname:el2[2],
                                            mname:el2[3],
                                            extname:el2[5],
                                            loantype:"GSIS MPL",
                                            amount:el2[MPL],
                                            loancode:"77",
                                            loanname:'GSIS MPL',
                                        })
                                    }
                                }else{
                                    // empty_id.push({
                                    //     id:el2[0],
                                    //     lname:el2[1],
                                    //     fname:el2[2],
                                    //     mname:el2[3],
                                    //     extname:el2[5]
                                    // })
                                }
                                
                        }
                        
                    })
                })
            break;
            //GSIS OLD
            case 3:
                tempData.forEach(el=>{
                    var CONSOLOAN = 0;
                    var ECARDPLUS = 0;
                    var SALARY_LOAN = 0;
                    var CASH_ADV = 0;
                    var EMRGYLN = 0;
                    var EDUC_ASST = 0;
                    var ELA = 0;
                    var SOS = 0;
                    var PLREG = 0;
                    var PLOPT = 0;
                    var REL = 0;
                    var LCH_DCS = 0;
                    var STOCK_PURCHASE = 0;
                    var OPT_LIFE = 0;
                    var CEAP = 0;
                    var EDU_CHILD = 0;
                    var GENESIS = 0;
                    var GENPLUS = 0;
                    var GENFLEXI = 0;
                    var GENSPCL = 0;
                    var GFAL = 0;
                    var MPL = 0;
                    
                    el.forEach((el2,key)=>{
                        if(key === 0){
                            CONSOLOAN = el2.indexOf('CONSOLOAN')
                            ECARDPLUS = el2.indexOf('ECARDPLUS')
                            SALARY_LOAN = el2.indexOf('SALARY_LOAN')
                            CASH_ADV = el2.indexOf('CASH_ADV')
                            EMRGYLN = el2.indexOf('EMRGYLN')
                            EDUC_ASST = el2.indexOf('EDUC_ASST')
                            ELA = el2.indexOf('ELA')
                            SOS = el2.indexOf('SOS')
                            PLREG = el2.indexOf('PLREG')
                            PLOPT = el2.indexOf('PLOPT')
                            REL = el2.indexOf('REL')
                            LCH_DCS = el2.indexOf('LCH_DCS')
                            STOCK_PURCHASE = el2.indexOf('STOCK_PURCHASE')
                            OPT_LIFE = el2.indexOf('OPT_LIFE')
                            CEAP = el2.indexOf('CEAP')
                            EDU_CHILD = el2.indexOf('EDU_CHILD')
                            GENESIS = el2.indexOf('GENESIS')
                            GENPLUS = el2.indexOf('GENPLUS')
                            GENFLEXI = el2.indexOf('GENFLEXI')
                            GENSPCL = el2.indexOf('GENSPCL')
                            GFAL = el2.indexOf('GFAL')
                            MPL = el2.indexOf('MPL')
                        }
                        if(key !==0){
                                if(el2[0]){
                                    // list.push({
                                    //     id:el2[0],
                                    //     lname:el2[1],
                                    //     fname:el2[2],
                                    //     mname:el2[3],
                                    //     extname:el2[5],
                                    //     "CONSOLOAN":el2[13],
                                    //     "ECARDPLUS":el2[14],
                                    //     "SALARY_LOAN":el2[15],
                                    //     "CASH_ADV":el2[16],
                                    //     "EMRGYLN":el2[17],
                                    //     "EDUC_ASST":el2[18],
                                    //     "ELA":el2[19],
                                    //     "SOS":el2[20],
                                    //     "PLREG":PLREG>0?el2[PLREG]:0,
                                    //     "PLOPT":el2[22],
                                    //     "REL":el2[23],
                                    //     "LCH_DCS":el2[24],
                                    //     "STOCK_PURCHASE":el2[25],
                                    //     "OPT_LIFE":el2[26],
                                    //     "CEAP":el2[27],
                                    //     "EDU_CHILD":el2[28],
                                    //     "GENESIS":el2[29],
                                    //     "GENPLUS":el2[30],
                                    //     "GENFLEXI":el2[31],
                                    //     "GENSPCL":el2[32],
                                    //     "HELP":el2[33],
                                    //     "GFAL":el2[34],
                                    //     "MPL":el2[35],
                                    //     "CPL":el2[36],
                                    //     "GEL":el2[37]
                                    // })
                                    if(el2[CONSOLOAN]>0){
                                        list2.push({
                                            id:el2[0],
                                            lname:el2[1],
                                            fname:el2[2],
                                            mname:el2[3],
                                            extname:el2[5],
                                            loantype:"CONSO OLD",
                                            amount:el2[CONSOLOAN],
                                            loancode:"35",
                                            loanname:'GSIS CONSOLIDATED LOAN - OLD',
                                        })
                                    }
                                    if(el2[ECARDPLUS]>0){
                                        list2.push({
                                            id:el2[0],
                                            lname:el2[1],
                                            fname:el2[2],
                                            mname:el2[3],
                                            extname:el2[5],
                                            loantype:"E-CARD OLD",
                                            amount:el2[ECARDPLUS],
                                            loancode:"37",
                                            loanname:'GSIS E-CARD PLUS - OLD ACCOUNTS',
                                        })
                                    }
                                    if(el2[SALARY_LOAN]>0){
                                        list2.push({
                                            id:el2[0],
                                            lname:el2[1],
                                            fname:el2[2],
                                            mname:el2[3],
                                            extname:el2[5],
                                            loantype:"ESL OLD",
                                            amount:el2[SALARY_LOAN],
                                            loancode:"16",
                                            loanname:'GSIS ENHANCED SALARY LOAN - OLD',
                                        })
                                    }
                                    if(el2[CASH_ADV]>0){
                                        list2.push({
                                            id:el2[0],
                                            lname:el2[1],
                                            fname:el2[2],
                                            mname:el2[3],
                                            extname:el2[5],
                                            loantype:"CASH ADVANCE",
                                            amount:el2[CASH_ADV],
                                            loancode:"46",
                                            loanname:'GSIS CASH ADVANCE - OLD ACCOUNT',
                                        })
                                    }
                                    if(el2[EMRGYLN]>0){
                                        list2.push({
                                            id:el2[0],
                                            lname:el2[1],
                                            fname:el2[2],
                                            mname:el2[3],
                                            extname:el2[5],
                                            loantype:"EMRGYLN OLD",
                                            amount:el2[EMRGYLN],
                                            loancode:"33",
                                            loanname:'GSIS EMERGENCY LOAN - OLD ACCOUNTS',
                                        })
                                    }
                                    if(el2[EDUC_ASST]>0){
                                        list2.push({
                                            id:el2[0],
                                            lname:el2[1],
                                            fname:el2[2],
                                            mname:el2[3],
                                            extname:el2[5],
                                            loantype:"EDUC_ ASST",
                                            amount:el2[EDUC_ASST],
                                            loancode:"6",
                                            loanname:'GSIS EDUC ASSISTANCE',
                                        })
                                    }
                                    // if(el2[19]>0){
                                    //     list2.push({
                                    //         id:el2[0],
                                    //         lname:el2[1],
                                    //         fname:el2[2],
                                    //         mname:el2[3],
                                    //         extname:el2[5],
                                    //         loantype:"EDUC_ASST OLD",
                                    //         amount:el2[amount_index],
                                    //         loancode:"34",
                                    //         loanname:'GSIS EDUC ASSISTANCE - OLD ACCOUNTS',
                                    //     })
                                    // }
                                    if(el2[SOS]>0){
                                        list2.push({
                                            id:el2[0],
                                            lname:el2[1],
                                            fname:el2[2],
                                            mname:el2[3],
                                            extname:el2[5],
                                            loantype:"SOS OLD",
                                            amount:el2[SOS],
                                            loancode:"38",
                                            loanname:'GSIS SOS LOAN - OLD',
                                        })
                                    }
                                    if(el2[PLREG]>0){
                                        list2.push({
                                            id:el2[0],
                                            lname:el2[1],
                                            fname:el2[2],
                                            mname:el2[3],
                                            extname:el2[5],
                                            loantype:"PLRG OLD",
                                            amount:el2[PLREG],
                                            loancode:"2",
                                            loanname:'GSIS POLICY LOAN REGULAR - OLD ACCOUNTS',
                                        })
                                    }
                                    if(el2[PLOPT]>0){
                                        list2.push({
                                            id:el2[0],
                                            lname:el2[1],
                                            fname:el2[2],
                                            mname:el2[3],
                                            extname:el2[5],
                                            loantype:"PLOPT OLD",
                                            amount:el2[PLOPT],
                                            loancode:"32",
                                            loanname:'GSIS POLICY LOAN OPTIONAL - OLD ACCOUNTS',
                                        })
                                    }
                                    if(el2[REL]>0){
                                        list2.push({
                                            id:el2[0],
                                            lname:el2[1],
                                            fname:el2[2],
                                            mname:el2[3],
                                            extname:el2[5],
                                            loantype:"REL",
                                            amount:el2[REL],
                                            loancode:"54",
                                            loanname:'GSIS REAL ESTATE LOAN',
                                        })
                                    }
                                    if(el2[OPT_LIFE]>0){
                                        list2.push({
                                            id:el2[0],
                                            lname:el2[1],
                                            fname:el2[2],
                                            mname:el2[3],
                                            extname:el2[5],
                                            loantype:"OPT_LIFE",
                                            amount:el2[OPT_LIFE],
                                            loancode:"61",
                                            loanname:'GSIS UOLI PREMIUM',
                                        })
                                    }
                                    if(el2[CEAP]>0){
                                        list2.push({
                                            id:el2[0],
                                            lname:el2[1],
                                            fname:el2[2],
                                            mname:el2[3],
                                            extname:el2[5],
                                            loantype:"GSIS CEAP - OLD ACCOUNTS",
                                            amount:el2[CEAP],
                                            loancode:"48",
                                            loanname:'GSIS CEAP - OLD ACCOUNTS',
                                        })
                                    }
                                    if(el2[GFAL]>0){
                                        list2.push({
                                            id:el2[0],
                                            lname:el2[1],
                                            fname:el2[2],
                                            mname:el2[3],
                                            extname:el2[5],
                                            loantype:"GSIS GFAL",
                                            amount:el2[GFAL],
                                            loancode:"72",
                                            loanname:'GSIS GFAL',
                                        })
                                    }
                                    if(el2[MPL]>0){
                                        list2.push({
                                            id:el2[0],
                                            lname:el2[1],
                                            fname:el2[2],
                                            mname:el2[3],
                                            extname:el2[5],
                                            loantype:"GSIS MPL",
                                            amount:el2[MPL],
                                            loancode:"77",
                                            loanname:'GSIS MPL',
                                        })
                                    }
                                }else{
                                    // empty_id.push({
                                    //     id:el2[0],
                                    //     lname:el2[1],
                                    //     fname:el2[2],
                                    //     mname:el2[3],
                                    //     extname:el2[5]
                                    // })
                                }
                                
                        }
                        
                    })
                })
            break;
        }
        if(empty_id.length>0){
            setEmptyIDData(empty_id);
            setHasError(true)
        }
        console.log(sortString(list2,'lname'))
        
        setData2(sortString(list2,'lname'))
    }
    const [openSearch,setOpenSearch] = useState('');
    const [selectedEmp,setSelectedEmp] = useState('');
    const [selectedEmpData,setSelectedEmpData] = useState([]);

    const handleUpdate = (item)=>{
        console.log(item)
        setSelectedEmp(item.lname)
        setSelectedEmpData(item)
        setOpenSearch(true)
    }
    const handleRemovePerson = (item) => {
        console.log(item)
        console.log(data2, data)
    }
    const updateSelect = async (data)=>{
        try{
            APILoading('info','Updating Data','Please wait')
            let t_data = {
                emp_no:data.id_no,
                data:selectedEmpData
            }

            const res = await updateEmpBillingID(t_data);
            if(res.data.status === 200){
                let temp = [...errorUploadData];
                temp.forEach((el,key)=>{
                    if(el.id === selectedEmpData.id && el.loan_abbr_name === selectedEmpData.loan_abbr_name){
                        temp.splice(key,1);
                    }
                })
                setErrorUploadData(temp)
                APISuccess(res.data.message);
            }else{
                APIError(res.data.message)
            }
        }catch(err){
            APIError(err)
        }
        
    }
    return(
        <Box>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography sx={{color:''}}>{props.title}</Typography>
                </Grid>
                {/* <ManualAdd loanType = {props.loanType}/> */}
                <Grid item xs={12} sx={{display:'flex',gap:1,justifyContent:'center'}}>
                    <TextField type="file" onChange={handleChangeFile} id = 'excelFile' inputProps={{accept:'.xlsx,.xls'}} size="small"/>
                    <FormControl
                        >
                        <InputLabel id="demo-simple-select-label">File Type</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={fileType}
                        label="File Type"
                        onChange={handleChangeFileType}
                        sx={{width:200}}
                        size="small"
                        >
                        <MenuItem value={1}>Default</MenuItem>
                        <MenuItem value={2}>GSIS (New)</MenuItem>
                        <MenuItem value={3}>GSIS (Old)</MenuItem>
                        {/* <MenuItem value={1}>GSIS (Old)</MenuItem> */}
                        </Select>
                    </FormControl>
                    <Button startIcon={<ClearIcon/>} color='error' variant="outlined" sx={{height:'100%'}} onClick={handleClearFile} size="small">Remove File</Button>
                    {
                        fileType !== 1
                        ?
                        (
                        <Button variant="contained" onClick={handleProceedNotDefault} size="small">Proceed</Button>
                        )
                        :
                        null
                    }
                </Grid>
                    {
                        fileType === 1
                        ?
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
                                            size="small"
                                        />
                                        <Tooltip title={`Remove ${item.sheet_name} sheet`} variant='outlined'><Button color='error' onClick={()=>handleRemoveSheet(key)}><CancelIcon/></Button></Tooltip>
                                        </Box>
                                        
                                    )
                                })
                            }
                            </Box>
                            <Box sx={{display:'flex',justifyContent:'flex-end',mt:1}}>
                                <Button variant="contained" onClick={handleProceed} disabled={sheets.length>0?false:true}>Proceed</Button>
                            </Box>

                            </Grid>
                            
                        :
                        null
                        :
                        null
                    }
                {
                    fileType == 1
                    ?
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
                                        <TableFooter sx={{position:'sticky',bottom:0,background:'#fff'}}>
                                            <TableRow>
                                                <TableCell colSpan={7}>Total Record: {data.length}</TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    )
                    :
                    null
                    :
                    data2.length>0
                    ?
                    (
                        <Grid item xs={12}>
                            <Paper>
                                <TableContainer sx={{maxHeight:'60vh'}}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell>
                                                    BP No.
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    Last Name
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
                                                data2.map((item,key)=>{
                                                    return(
                                                        <TableRow key = {key} sx={{background:!item.id || !item.amount ?red[800]:'auto'}}>
                                                            <StyledTableCell>
                                                                {item.id}
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                {item.lname}
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                {item.fname}
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                {item.mname}
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                {item.extname}
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                {item.loantype}
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                {item.amount}
                                                            </StyledTableCell>
                                                        </TableRow>
                                                    )
                                                })
                                            }
                                        </TableBody>
                                        <TableFooter sx={{position:'sticky',bottom:0,background:'#fff'}}>
                                            <TableRow>
                                                <TableCell colSpan={7}>Total Record: {data2.length}</TableCell>
                                            </TableRow>
                                        </TableFooter>
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
                    data.length>0 || data2.length>0
                    ?
                    (
                        <Grid item xs={12}>
                            <Period handleSubmit = {handleSubmit}/>
                        </Grid>

                    )
                    :
                    null
                }
                
            </Grid>
            <LargeModal open = {openErrorUpload} close = {()=>setOpenErrorUpload(false)} title='Error Upload Info'>
                <Paper>
                    <TableContainer sx={{maxHeight:'60vh'}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>
                                        ID
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        Name
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        Loan Type
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        Remarks
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        Actions
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {errorUploadData.map((item,key)=>{
                                    return (
                                        <TableRow key={key}>
                                            <StyledTableCell>
                                                {item.id}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {formatName(item.fname,item.mname,item.lname,item.extname)}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {item.loan_abbr_name}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {item.remarks}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Stack spacing={1}>
                                                    <Button startIcon={<EditIcon/>} size="small" variant="outlined" onClick={()=>handleUpdate(item)}>Update</Button>
                                                    {/* <Button startIcon={<PersonRemoveIcon/>} size="small" color="error" variant="outlined" onClick={()=>handleRemovePerson(item)}>Remove</Button> */}
                                                </Stack>
                                            </StyledTableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                            <TableFooter sx={{position:'sticky',bottom:0}}>
                                <TableRow>
                                    <StyledTableCell colSpan={5} sx={{background:'#fff'}}>
                                        <em>Total Records: {errorUploadData.length}</em>
                                    </StyledTableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </Paper>
            </LargeModal>
            <SearchEmpModal val={selectedEmp} open = {openSearch} close= {()=>setOpenSearch(false)} title='Search Employee' updateSelect = {updateSelect} type={1}>
            
            </SearchEmpModal>
        </Box>
    )
}