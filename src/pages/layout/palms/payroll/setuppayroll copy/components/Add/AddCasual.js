import React, { useEffect, useRef, useState } from "react";
import { Box, Grid, Autocomplete, TextField, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, TableFooter, Typography, IconButton } from "@mui/material";
import { getDeptPayroll, getPayrollGroup, postPayroll } from "../../SetupPayrollRequests";
import { APIError, APISuccess, formatExtName, formatMiddlename, formatTwoDateToText, formatWithCommas, isNumeric, truncateToDecimals } from "../../../../../customstring/CustomString";
import SendIcon from '@mui/icons-material/Send';
import Swal from "sweetalert2";
import { APILoading } from "../../../../../apiresponse/APIResponse";
import { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { blue, green, grey } from "@mui/material/colors";
import PaginateCard from "../../../../../selfserviceportal/leaveapplication/Card/PaginateCard";
import InfoIcon from '@mui/icons-material/Info';
import SmallModal from "../../../../../custommodal/SmallModal";
import SmallestModal from "../../../../../custommodal/SmallestModal";
import { CasualPrint } from "../forms/casual/CasualPrint";
import { auditLogs } from "../../../../../auditlogs/Request";
import ReactToPrint,{useReactToPrint} from 'react-to-print';
import PrintIcon from '@mui/icons-material/Print';
import { getPayGroup } from "../../../../../customprocessdata/CustomProcessData";
import moment from "moment";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
[`&.${tableCellClasses.head}`]: {
    backgroundColor: blue[800],
    color: theme.palette.common.white,
    fontSize:'.7rem',
    padding:5
},
[`&.${tableCellClasses.body}`]: {
    fontSize: '.7rem',
    padding:10,
    fontWeight:'light'
},
[`&.${tableCellClasses.footer}`]: {
    fontSize: '.7rem',
    padding:10
}
}));
export const AddCasual = ({offices,selectedPaySetup}) =>{
    const [page,setPage] = useState(1);
    const [rowsPerPage,setRowsPerPage] = useState(10)
    const handleChagePage = (e,page) =>{
        setPage(page)
    }
    const [selectedOffice,setSelectedOffice] = useState(null)
    const [empList,setEmpList] = useState([])
    const [periodFrom,setPeriodFrom] = useState()
    const [periodTo,setPeriodTo] = useState()
    const [GSIS,setGSIS] = useState(0)
    const [PhilHealth,setPhilHealth] = useState([])
    const [loans,setLoans] = useState([])
    const [PERA,setPERA] = useState({amount:0})
    const [signatories,setSignatorires] = useState(null);
    const [empStatus,setEmpStatus] = useState('CS')
    const [user,setuser] = useState('')

    const handleProceed = async (e)=>{
        e.preventDefault();
        if(selectedOffice){
            APILoading('info','Loading Data','Please wait...')
            let dtr_from = moment(selectedPaySetup.period_from).subtract(1,'months').format('YYYY-MM-DD');
            let dtr_to = moment(selectedPaySetup.period_to).subtract(1,'months').format('YYYY-MM-DD');
            let period_from = selectedPaySetup.period_from;
            let period_to = selectedPaySetup.period_to;

            let t_data = {
                dept_code:selectedOffice.dept_code,
                emp_status:empStatus,
                dtr_from:dtr_from,
                dtr_to:dtr_to,
                period_from:period_from,
                period_to:period_to,
                group_no:selectedPayrollGroup.group_no
            }
            
            setPeriodFrom(period_from)
            setPeriodTo(period_to)
            const res = await getDeptPayroll(t_data);

            console.log(res.data)
            setEmpList(res.data.emp_list)
            // res.data.emp_list.forEach(el=>{
            //     el.gsis_personal_share = el.m_salary*(res.data.contri_gsis.personal_share/100);
            //     el.gsis_gov_share = el.m_salary*(res.data.contri_gsis.gov_share/100);
            // })
            setGSIS(res.data.contri_gsis)
            setPhilHealth(res.data.contri_philhealth)
            setPERA(res.data.pera)
            setSignatorires(res.data.signatories)
            setuser(res.data.user)
            var loans = res.data.emp_list.filter(el => {
                return el.loan_dtl
            }).map(obj=>{
                return JSON.parse(obj.loan_dtl)
            })
            var loans_arr = [];
            loans.forEach(el=>{
                el.forEach(el2=>{
                    loans_arr.push(el2);
                })
            })
            // res.data.emp_list.forEach(el=>{
            //     JSON.parse()
            // })
            const unique_loans = [...new Set(loans_arr.map(item => item.loan_abbr))];
            setLoans(unique_loans.sort())
            Swal.close();
        }else{
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                text:'Please provide all data'
            })
        }
    }
    
    const formatMSalary = (value) =>{
        return value/12
    }
    const displayPH = (item)=>{
        var salary = item/12;
        var arr = PhilHealth.filter(el => salary >= parseFloat(el.min_sal) && salary <= parseFloat(el.max_sal));
        if(arr.length>0){
            // return parseFloat(arr[0].min_sal);
            if(parseInt(arr[0].comp_type) === 0){
                return  formatWithCommas(parseFloat(arr[0].amount).toFixed(2));
            }else{
                return formatWithCommas(parseFloat((salary*(arr[0].amount/100))/2).toFixed(2));
            }
        }
    }
    const displayPHPersonal = (item)=>{
        var salary = item/12;
        var arr = PhilHealth.filter(el => salary >= parseFloat(el.min_sal) && salary <= parseFloat(el.max_sal));
        if(arr.length>0){
            if(parseInt(arr[0].comp_type) === 0){
                return  formatWithCommas(parseFloat(arr[0].amount).toFixed(2));
            }else{
                return formatWithCommas((truncateToDecimals(parseFloat((salary*(arr[0].amount/100))/2))).toFixed(2));
            }
        }
    }
    useEffect(()=>{
        if(empList.length>0){
            var table  = document.getElementById('setup-payroll-table')
            var msalarytable = table;
            var wtaxtable = table;
            var accruedtable = table;
            var peratable = table;
            var gsispertable = table;
            var gsisgovtable = table;
            var ecctable = table;
            var pagibigpertable = table;
            var pagibiggovtable = table;
            var phpertable = table;
            var phgovtable = table;
            var totdeductiontable = table;
            var pay15thtable = table;
            var pay30thtable = table;

            //monthly salary
            let msalarytable_arr = Array.from(msalarytable.rows)

            msalarytable_arr.splice(msalarytable_arr.length-1,1)

            let monthlySubTotal = msalarytable_arr.slice(3).reduce((total,row) => {
                var rem_commas = (row.cells[2]?.innerHTML).replace(',','');
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
                
            }, 0);

            //end monthly salary

            //Accrued
            let accruedtable_arr = Array.from(accruedtable.rows)

            accruedtable_arr.splice(accruedtable_arr.length-1,1)

            let accruedSubTotal = accruedtable_arr.slice(3).reduce((total,row) => {
                var rem_commas = (row.cells[4]?.innerHTML).replace(',','');
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
                
            }, 0);

            //end Accrued


            //PERA
            let peratable_arr = Array.from(peratable.rows)

            peratable_arr.splice(peratable_arr.length-1,1)

            let peraSubTotal = peratable_arr.slice(3).reduce((total,row) => {
                var rem_commas = (row.cells[5]?.innerHTML).replace(',','');
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
                
            }, 0);

            //end PERA

            //withholding tax
            let wtaxtable_arr = Array.from(wtaxtable.rows)

            wtaxtable_arr.splice(wtaxtable_arr.length-1,1)

            let taxSubTotal = wtaxtable_arr.slice(3).reduce((total,row) => {
                var rem_commas = (row.cells[6]?.innerHTML).replace(',','');
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
                
            }, 0);

            //end withholding tax
            

            //GSIS personal share

            let gsispertable_arr = Array.from(gsispertable.rows)

            gsispertable_arr.splice(gsispertable_arr.length-1,1)

            let gsisPerSubTotal = gsispertable_arr.slice(3).reduce((total,row) => {
                var rem_commas = (row.cells[7]?.innerHTML).replace(',','');
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
            
            }, 0);
            // End GSIS personal share

            //GSIS gov't share
            let gsisgovtable_arr = Array.from(gsisgovtable.rows)

            gsisgovtable_arr.splice(gsisgovtable_arr.length-1,1)

            let gsisGovSubTotal = gsisgovtable_arr.slice(3).reduce((total,row) => {
                var rem_commas = (row.cells[8].innerHTML).replace(',','');
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
            }, 0);
            //End GSIS gov't share

            

            //ECC

            let ecctable_arr = Array.from(ecctable.rows)

            ecctable_arr.splice(ecctable_arr.length-1,1)

            let eccSubTotal = ecctable_arr.slice(3).reduce((total,row) => {
                var rem_commas = (row.cells[9]?.innerHTML).replace(',','');
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
            
            }, 0);
            // End ECC

            //PAGIBIG personal share

            let pagibigpertable_arr = Array.from(pagibigpertable.rows)

            pagibigpertable_arr.splice(pagibigpertable_arr.length-1,1)

            let pagibigPerSubTotal = pagibigpertable_arr.slice(3).reduce((total,row) => {
                var rem_commas = (row.cells[10]?.innerHTML).replace(',','');
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
            
            }, 0);
            // End PAGIBIG personal share

            //PAGIBIG gov share

            let pagibigpgovtable_arr = Array.from(pagibiggovtable.rows)

            pagibigpgovtable_arr.splice(pagibigpgovtable_arr.length-1,1)

            let pagibigGovSubTotal = pagibigpgovtable_arr.slice(3).reduce((total,row) => {
                var rem_commas = (row.cells[11]?.innerHTML).replace(',','');
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
            
            }, 0);
            // End PAGIBIG gov share


            //PHILHEALTH personal share

            let phpertable_arr = Array.from(phpertable.rows)

            phpertable_arr.splice(phpertable_arr.length-1,1)

            let phPerSubTotal = phpertable_arr.slice(3).reduce((total,row) => {
                var rem_commas = (row.cells[12]?.innerHTML).replace(',','');
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
            
            }, 0);
            // End PHILHEALTH personal share

            //PHILHEALTH gov share

            let phgovtable_arr = Array.from(phgovtable.rows)

            phgovtable_arr.splice(phgovtable_arr.length-1,1)

            let phGovSubTotal = phgovtable_arr.slice(3).reduce((total,row) => {
                var rem_commas = (row.cells[13]?.innerHTML).replace(',','');
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
            
            }, 0);

            // End PHILHEALTH gov share

            //Loans
            const col_num = Math.floor(loans.length/3)+(loans.length%3===0?0:1);
            const cols = [];
            let col_page = 1;
            let col_per_page = 3;
            let start = 15;
            for(let i=0;i<col_num;i++){
                let t_total_loan = 0;
                loans.slice((col_page-1)*col_per_page,(col_page-1)*col_per_page+col_per_page).forEach(el2=>{
                    empList.slice((page-1)*rowsPerPage,(page-1)*rowsPerPage+rowsPerPage).forEach(el=>{
                        if(el.loan_dtl){
                            if(isExists(el,el2)){
                                t_total_loan+=parseFloat(isExists(el,el2).replace(',',''))
                            }
                            
                        }
                    })
                })
                console.log(t_total_loan)
                document.getElementById("loan-total-"+i).innerHTML = formatWithCommas(t_total_loan.toFixed(2));
                start++;
                col_page++;
            }
            
            //End loans

            //Total Deductions

            let totdeductiontable_arr = Array.from(totdeductiontable.rows)

            totdeductiontable_arr.splice(totdeductiontable_arr.length-1,1)

            let totDeductionsSubTotal = totdeductiontable_arr.slice(3).reduce((total,row) => {
                var rem_commas = (row.cells[16+(loans.length>0?Math.floor(loans.length/3)+(loans.length%3===0?0:1):1)]?.innerHTML).replace(',','');
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
            
            }, 0);

            // End Total Deductions

            //Total Deductions


            //15th pay
            let pay15thtable_arr = Array.from(pay15thtable.rows)

            pay15thtable_arr.splice(pay15thtable_arr.length-1,1)

            let pay15thSubTotal = pay15thtable_arr.slice(3).reduce((total,row) => {
                var rem_commas = (row.cells[17+(loans.length>0?Math.floor(loans.length/3)+(loans.length%3===0?0:1):1)]?.innerHTML).replace(',','');
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
            
            }, 0);

            // End 15th pay

            //30th pay
            let pay30thtable_arr = Array.from(pay30thtable.rows)

            pay30thtable_arr.splice(pay30thtable_arr.length-1,1)

            let pay30thSubTotal = pay30thtable_arr.slice(3).reduce((total,row) => {
                var rem_commas = (row.cells[18+(loans.length>0?Math.floor(loans.length/3)+(loans.length%3===0?0:1):1)]?.innerHTML).replace(',','');
                return total + truncateToDecimals((isNumeric(rem_commas) ? parseFloat(rem_commas) : 0));
            
            }, 0);

            // End 30th pay

            
            // const total = empList.map((item) => item.m_salary)
            //     .reduce((a, b) =>  a + b, 0);
            //   console.log(total);

            //Update footer td value
            document.getElementById("m-salary-total").innerHTML = formatWithCommas(monthlySubTotal.toFixed(2));
            document.getElementById("amount-accrued").innerHTML = formatWithCommas(accruedSubTotal.toFixed(2));
            document.getElementById("pera-total").innerHTML = formatWithCommas(peraSubTotal.toFixed(2));
            document.getElementById("w-tax-total").innerHTML = formatWithCommas(taxSubTotal.toFixed(2));
            document.getElementById("gsis-personal-total").innerHTML = formatWithCommas(gsisPerSubTotal.toFixed(2));
            document.getElementById("gsis-gov-total").innerHTML = formatWithCommas(gsisGovSubTotal.toFixed(2));
            document.getElementById("ecc-total").innerHTML = formatWithCommas(eccSubTotal.toFixed(2));
            document.getElementById("pagibig-personal-total").innerHTML = formatWithCommas(pagibigPerSubTotal.toFixed(2));
            document.getElementById("pagibig-gov-total").innerHTML = formatWithCommas(pagibigGovSubTotal.toFixed(2));
            document.getElementById("ph-personal-total").innerHTML = formatWithCommas(phPerSubTotal.toFixed(2));
            document.getElementById("ph-gov-total").innerHTML = formatWithCommas(phGovSubTotal.toFixed(2));
            document.getElementById("deductions-total").innerHTML = formatWithCommas(totDeductionsSubTotal.toFixed(2));
            document.getElementById("15thpay-total").innerHTML = formatWithCommas(pay15thSubTotal.toFixed(2));
            document.getElementById("30thpay-total").innerHTML = formatWithCommas(pay30thSubTotal.toFixed(2));
        }
        
    },[empList,page,loans])
    const loansCell = () =>{
        const col_num = Math.floor(loans.length/3)+(loans.length%3 === 0?0:1);
        const cols = [];
        let col_page = 1;
        let col_per_page = 3;
        for(let i=0;i<col_num;i++){
            cols.push(<StyledTableCell rowSpan={2}>
                <Box sx={{display:'flex',flexDirection:'column',fontSize:'.7rem'}}>
                    {
                        loans.slice((col_page-1)*col_per_page,(col_page-1)*col_per_page+col_per_page).map((item,key)=>{
                            return (
                                <span key={key} style={{paddingLeft:'13px',textIndent:'-13px'}}>
                                    {key+1}. {item}
                                </span>
                            )
                        })
                    }
                </Box>
                </StyledTableCell>
            )
            col_page++;
        }
        if(col_num>0){
            return (
                <>{cols}</>
            )
        }else{
            return <StyledTableCell rowSpan={2}></StyledTableCell>
        }

    }
    const loansCellFooter = () =>{
        const col_num = loans.length>0?Math.floor(loans.length/3)+(loans.length%3 === 0?0:1):1;
        const cols = [];
        for(let i=0;i<col_num;i++){
            cols.push(<StyledTableCell id={'loan-total-'+i} align="right">       
                </StyledTableCell>
            )
        }
        return (
            <>{cols}</>
        )
    }
    const checkLoansCell = (row) =>{
        const col_num = Math.floor(loans.length/3)+(loans.length%3===0?0:1);
        const cols = [];
        let col_page = 1;
        let col_per_page = 3;
        if(col_num>0){
            if(row.loan_dtl){
                for(let i=0;i<col_num;i++){
                    cols.push(<TableCell>
                            {
                                loans.slice((col_page-1)*col_per_page,(col_page-1)*col_per_page+col_per_page).map((item,key)=>{
                                    return (
                                        isExists(row,item)
                                        ?
                                        <span key={key} style={{display:'flex',justifyContent:'space-between',fontSize:'.7rem'}}>
                                            {key+1}. <span style={{color:'red'}}>{isExists(row,item)}</span>
                                        </span>
                                        :
                                        <span key={key}>
                                            
                                        </span>
                                    )
                                })
                            }
                        </TableCell>
                    )
                    col_page++;
                }
                return (
                    <>{cols}</>
                )
            }else{
                for(let i=0;i<col_num;i++){
                    cols.push(<TableCell>
                        </TableCell>
                    )
                }
                return (
                    <>{cols}</>
                )
            }
        }else{
            return (<TableCell></TableCell>)
        }
        
        
    }
    const isExists = (row,loan_abbr) =>{
        let loan_dtl_arr = JSON.parse(row.loan_dtl).filter(el=>el.loan_abbr === loan_abbr);
        if(loan_dtl_arr.length>0){
            return formatWithCommas(loan_dtl_arr[0].amount.toFixed(2))
        }else{
            return null;
        }
    }
    const totalDeductions = (item,key) =>{
        // var table  = document.getElementById('setup-payroll-table');
        // var total = 0;
        // var table_arr = Array.from(table.rows).slice(3)
        // table_arr.splice(table_arr.length-1,1);
        // console.log(key)
        // console.log(table_arr[key])
        // if(table_arr[key]?.cells.length>0){
        //     for(var j=0;j<table_arr[key].cells.length;j++){
        //         if(j ===6 || j ===7 || j ===10 || j === 12){
        //             // console.log(table_arr[i].cells[j].innerHTML)
        //             var rem_commas = (table_arr[key].cells[j].innerHTML).replace(',','');
        //             console.log(rem_commas)
        //             total+=(isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
        //         }
        //     }
        // }
        // var theTbl = document.getElementById('tblBlah');
        // for(var i=0;i<theTbl.length;i++)
        // {
        //     for(var j=0;j<theTbl.rows[i].cells.length;j++)
        //     {
        //         theTbl.rows[i].cells[j].onclick = alertInnerHTML;
        //     }
        // }
        
        if(item.loan_dtl){
            var t_total = JSON.parse(item.loan_dtl).map((el)=>{
                return el.amount
            }).reduce((total,amount)=>{
                return total + amount
            })
            return (
                t_total
            )
        }else{
            return 0;
        }
    }
    const [openLWOPDtl,setOpenLWOPDtl] = useState(false);
    const [LWOPDtlData,setLWOPDtlData] = useState([]);
    
    const handleOpenLWOPayDtl = (row)=>{
        setOpenLWOPDtl(true)
        setLWOPDtlData(row.lwopay_dtl);
    }
    const printPayroll = useRef()
    const reactToPrintPayroll  = useReactToPrint({
        content: () => printPayroll.current,
        documentTitle:'Payroll'
    });
    const beforePrint = () => {
        var logs = {
            action:'PRINT PAYROLL',
            action_dtl:'CASUAL - '+'FROM:'+periodFrom+'| TO:'+periodTo,
            module:'PAYROLL'
        }
        auditLogs(logs)
        reactToPrintPayroll()
        // console.log(moment(new Date()).format('MM/DD/YYYY h:mm: a'))
    }
    const [payrollGroup,setPayrollGroup] = useState([])
    const [selectedPayrollGroup,setSelectedPayrollGroup] = useState(null)
    
    const handleSelectOffice = (event,newValue)=>{
        setSelectedOffice(newValue)
        if(newValue){
            getPayGroup(newValue.dept_code,setPayrollGroup,empStatus)
            setSelectedPayrollGroup(null)
        }
    }
    const handleSaveOnly = async ()=>{
        try{
            APILoading('info','Saving payroll data','Please wait...')
            let t_data = {
                payroll_group_id:selectedPayrollGroup.payroll_group_id,
                group_name:selectedPayrollGroup.group_name,
                group_subname:selectedPayrollGroup.sub_name,
                data:empList,
                period_from:periodFrom,
                period_to:periodTo,
                year:selectedPaySetup.year,
                signatories:signatories,
                payroll_no:selectedPaySetup.payroll_no
            }
            console.log(t_data)
            const res = await postPayroll(t_data);
            console.log(res.data.data)

            if(res.data.status === 200){
                APISuccess(res.data.message)
            }else{
                APIError(res.data.message)
            }
        }catch(err){
            APIError(err)
        }
    }
    return (
        <Box sx={{maxHeight:'90vh',overflow:'auto'}}>
            <Grid container spacing = {1} sx={{pt:1}}>
                <Grid item xs={12}>
                <form style={{width:'100%',display:'flex',flexDirection:'row',gap:1}} onSubmit={handleProceed}>

                <Autocomplete
                    disablePortal
                    id="combo-box-offices"
                    options={offices}
                    getOptionLabel={(option) => option.dept_title}
                    isOptionEqualToValue={(option, value) => option.dept_code === value.dept_code }
                    // sx={{ width: 300 }}
                    fullWidth
                    size="small"
                    value = {selectedOffice}
                    onChange={handleSelectOffice}
                    renderInput={(params) => <TextField {...params} label="Filter Office" required/>}
                    />
                <Autocomplete
                    disablePortal
                    id="combo-box-pgroup"
                    options={payrollGroup}
                    getOptionLabel={(option) => option.group_name}
                    sx={{ width: 500 }}
                    // fullWidth
                    size="small"
                    value = {selectedPayrollGroup}
                    onChange={(event,newValue)=>{
                        setSelectedPayrollGroup(newValue)
                    }}
                    renderInput={(params) => <TextField {...params} label="Payroll Group" required/>}
                    />
                    <TextField label='Period Covered' value={formatTwoDateToText(selectedPaySetup.period_from,selectedPaySetup.period_to)} InputProps={{readOnly:true}} size="small" sx={{minWidth:190}}/>
                    <TextField label='Year' value = {selectedPaySetup.year} InputProps={{readOnly:true}} size="small"/>

                    {/* <TextField type="date" label='Period From' value={periodFrom} onChange={(val)=>setPeriodFrom(val.target.value)} InputLabelProps={{shrink:true}} required sx={{width:280}} size="small"/> */}
                    {/* <TextField type="date" label='Period To' value={periodTo} onChange={(val)=>setPeriodTo(val.target.value)} InputLabelProps={{shrink:true}} required sx={{width:280}} size="small"/> */}
                    <Button variant="contained" type="submit" sx={{pl:5,pr:5}} className="custom-roundbutton">Proceed</Button>
                    {
                        empList.length>0
                        ?
                        <Button onClick={handleSaveOnly} variant="contained" color="success" className="custom-roundbutton" sx={{pl:5,pr:5}}>Save</Button>
                        :
                        ''
                    }
                    {/* <Button variant="contained" type="submit" sx={{width:200}} className="custom-roundbutton">Proceed</Button>
                    {
                        empList.length>0
                        ?
                        <Button onClick={beforePrint} variant="outlined" startIcon={<PrintIcon/>} sx={{width:180}}>Print</Button>
                        :
                        ''
                    } */}
                </form>

                </Grid>
                <Grid item xs={12}>
                    <Paper>
                        <TableContainer sx={{maxHeight:'70vh'}}>
                            <Table id = 'setup-payroll-table'>
                                <TableHead sx={{position:'sticky',top:0,background:'#fff',zIndex:1}}>
                                    <TableRow>
                                        <StyledTableCell rowSpan={3} align="center">
                                            No.
                                        </StyledTableCell>
                                        <StyledTableCell rowSpan={3} align="center">
                                            Employee Name <br/>
                                            Position
                                        </StyledTableCell>
                                        <StyledTableCell rowSpan={3} align="center">
                                            Monthly Rate
                                        </StyledTableCell>
                                        <StyledTableCell rowSpan={3} align="center">
                                            LWOP <br/>
                                            Adjustment
                                        </StyledTableCell>
                                        <StyledTableCell rowSpan={3} align="center">
                                            Amount <br/>
                                            Accrued
                                        </StyledTableCell>
                                        <StyledTableCell rowSpan={3} align="center">
                                            PERA
                                        </StyledTableCell>
                                        <StyledTableCell rowSpan={3} align="center">
                                            Withholding <br/>
                                            Tax
                                        </StyledTableCell>
                                        <StyledTableCell colSpan={8} align="center">
                                            Contributions
                                        </StyledTableCell>
                                        <StyledTableCell align="center" colSpan={Math.floor(loans.length/3)+(loans.length%3==0?0:1)}>
                                            Loans
                                        </StyledTableCell>
                                        <StyledTableCell align="center" rowSpan={3}>
                                            Other Deductions
                                        </StyledTableCell>
                                        <StyledTableCell align="center" rowSpan={3}>
                                            Total <br/>
                                            Deductions
                                        </StyledTableCell>
                                        <StyledTableCell align="center" rowSpan={3}>
                                            15th <br/>
                                            Pay
                                        </StyledTableCell>
                                        <StyledTableCell align="center" rowSpan={3}>
                                            30th <br/>
                                            Pay
                                        </StyledTableCell>
                                    </TableRow>
                                    <TableRow>
                                        <StyledTableCell sx={{background:blue[600]+' !important'}} colSpan={3} align="center">GSIS</StyledTableCell>
                                        <StyledTableCell sx={{background:blue[600]+' !important'}} colSpan={2} align="center">Pag-Ibig</StyledTableCell>
                                        <StyledTableCell sx={{background:blue[600]+' !important'}} colSpan={2} align="center">PHIC</StyledTableCell>
                                        <StyledTableCell sx={{background:blue[600]+' !important'}}>Provident</StyledTableCell>
                                        {
                                            loansCell()
                                        }
                                    </TableRow>
                                    <TableRow>
                                        {/* GSIS */}
                                        <StyledTableCell align="center">Personal Share</StyledTableCell>
                                        <StyledTableCell align="center">Gov't Share</StyledTableCell>
                                        <StyledTableCell align="center">ECC</StyledTableCell>
                                        {/* End GSIS */}

                                        {/* PagIbig */}
                                        <StyledTableCell align="center">Personal Share</StyledTableCell>
                                        <StyledTableCell align="center">Gov't Share</StyledTableCell>
                                        {/* End PagIbig */}

                                        {/* PhilHealth */}
                                        <StyledTableCell align="center">Personal Share</StyledTableCell>
                                        <StyledTableCell align="center">Gov't Share</StyledTableCell>
                                        {/* End PhilHealth */}

                                        <StyledTableCell align="center">Personal Share</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        empList&&empList.slice((page-1)*rowsPerPage,(page-1)*rowsPerPage+rowsPerPage).map((item,key)=>{
                                        return(
                                            <TableRow key={item.id} sx={{'&:hover':{background:grey[200]}}}>
                                                <StyledTableCell>
                                                    {empList.findIndex(x=>x.emp_no === item.emp_no)+1}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                {`${item.lname}, ${item.fname} ${formatMiddlename(item.mname)} ${formatExtName(item.extname)}`}
                                                </StyledTableCell>
                                                <StyledTableCell align="right" sx={{color:green[800]}}>
                                                    {formatWithCommas(parseFloat(item.m_salary).toFixed(2))}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <Box sx={{display:'flex',flexDirection:"row",justifyContent:'space-between',alignItems:'center'}}>
                                                    {
                                                        item.total_wopay>0
                                                        ?
                                                        <IconButton color="info" onClick={()=>handleOpenLWOPayDtl(item)}><InfoIcon/></IconButton>
                                                        :
                                                        null
                                                    }
                                                    {
                                                        item.total_wopay>0
                                                        ?
                                                        <span>{formatWithCommas(parseFloat(item.total_wopay).toFixed(2))}</span>
                                                        :
                                                        '-'
                                                    }
                                                    </Box>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {
                                                        formatWithCommas(parseFloat(item.m_salary-item.total_wopay).toFixed(2))
                                                    }
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {formatWithCommas(parseFloat(item.pera).toFixed(2))}
                                                </StyledTableCell>
                                                
                                                
                                                <StyledTableCell align="right">
                                                    {item.tax>0?formatWithCommas((item.tax).toFixed(2)):'-'}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    {/* {formatWithCommas(((item.m_salary)*(Math.floor(GSIS.personal_share)/100)).toFixed(2))} */}
                                                    {formatWithCommas(item.gsis_personal_share.toFixed(2))}
                                                </StyledTableCell>
                                                
                                                <StyledTableCell align="right">
                                                    {/* {formatWithCommas(((item.m_salary)*(Math.floor(GSIS.gov_share)/100)).toFixed(2))} */}
                                                    {formatWithCommas(item.gsis_gov_share.toFixed(2))}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    100.00
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    {formatWithCommas(parseFloat(item.pagibig).toFixed(2))}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    100.00
                                                </StyledTableCell>
                                                

                                                <StyledTableCell align="right">
                                                    {/* {displayPHPersonal(item.salary)} */}
                                                    {formatWithCommas(truncateToDecimals(item.ph_personal_share).toFixed(2))}

                                                </StyledTableCell>


                                                <StyledTableCell align="right">
                                                    {/* {displayPH(item.salary)} */}
                                                    {formatWithCommas(item.ph_personal_share.toFixed(2))}

                                                </StyledTableCell>

                                                {/* provident */}
                                                <StyledTableCell align="right">
                                                    {item.provident>0?formatWithCommas(item.provident):'-'}
                                                </StyledTableCell>

                                                {/* loans */}

                                                {
                                                    checkLoansCell(item)
                                                }
                                                <StyledTableCell>
                                                </StyledTableCell>

                                                {/* Total Dedcution */}
                                                <StyledTableCell align="right">
                                                    {/* {
                                                        formatWithCommas(totalDeductions(item,key).toFixed(2))
                                                    } */}
                                                    {/* {item.tax} */}
                                                    {
                                                        formatWithCommas((parseFloat(item.tax)+parseFloat(item.gsis_personal_share)+parseFloat(item.pagibig)+parseFloat(item.ph_personal_share)+parseFloat(item.total_wopay)+totalDeductions(item)).toFixed(2))
                                                    }
                                                </StyledTableCell>
                                                {/* End Total Dedcution */}

                                                <StyledTableCell>
                                                    {formatWithCommas(((parseFloat(item.m_salary+parseFloat(item.pera))-(parseFloat(item.tax)+parseFloat(item.gsis_personal_share)+parseFloat(item.pagibig)+parseFloat(item.ph_personal_share)+parseFloat(item.total_wopay)+totalDeductions(item)))/2).toFixed(2))}
                                                    {/* {formatWithCommas(((
                                                        (item.m_salary+item.pera)-totalDeductions(item,key)
                                                    )/2).toFixed(2))} */}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {formatWithCommas(truncateToDecimals((parseFloat(item.m_salary+parseFloat(item.pera))-(parseFloat(item.tax)+parseFloat(item.gsis_personal_share)+parseFloat(item.pagibig)+parseFloat(item.ph_personal_share)+parseFloat(item.total_wopay)+totalDeductions(item)))/2).toFixed(2))}
                                                    {/* {formatWithCommas(truncateToDecimals(/2).toFixed(2))} */}
                                                </StyledTableCell>
                                            </TableRow>
                                        )
                                    })
                                    }
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <StyledTableCell colSpan={2}>Page Total</StyledTableCell>
                                        <StyledTableCell id ='m-salary-total' align="right"></StyledTableCell>
                                        <StyledTableCell></StyledTableCell>
                                        <StyledTableCell id='amount-accrued' align="right"></StyledTableCell>
                                        <StyledTableCell id='pera-total' align="right"></StyledTableCell>
                                        <StyledTableCell id='w-tax-total' align="right"></StyledTableCell>
                                        <StyledTableCell id ='gsis-personal-total' align="right"></StyledTableCell>
                                        <StyledTableCell id = 'gsis-gov-total' align="right"></StyledTableCell>
                                        <StyledTableCell id = 'ecc-total' align="right"></StyledTableCell>
                                        <StyledTableCell id = 'pagibig-personal-total' align="right"></StyledTableCell>
                                        <StyledTableCell id = 'pagibig-gov-total' align="right"></StyledTableCell>
                                        <StyledTableCell id = 'ph-personal-total' align="right"></StyledTableCell>
                                        <StyledTableCell id = 'ph-gov-total' align="right"></StyledTableCell>
                                        <StyledTableCell></StyledTableCell>
                                        {
                                            loansCellFooter()
                                        }
                                        <StyledTableCell></StyledTableCell>
                                        <StyledTableCell id = 'deductions-total' align="right"></StyledTableCell>
                                        <StyledTableCell id = '15thpay-total' align="right"></StyledTableCell>
                                        <StyledTableCell id = '30thpay-total' align="right"></StyledTableCell>

                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </Paper>
                    {
                        empList.length>0
                        ?
                        <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',mt:1}}>
                            <PaginateCard data = {empList} page={page} rowsPerPage={rowsPerPage} handleChagePage = {handleChagePage}/>
                        </Grid>
                        :
                        null
                    }
                </Grid>
                <SmallestModal open = {openLWOPDtl} close = {()=>setOpenLWOPDtl(false)} title='LWOP Details'>
                    <ol>
                        {
                            LWOPDtlData.map((item)=>{
                                return (
                                    <li key={item.type}>{item.type}: {item.total}</li>
                                )
                            })
                        }
                    </ol>
                </SmallestModal>

            </Grid>
            <div style={{display:'none'}}>
                <CasualPrint ref={printPayroll} empList = {empList} loans = {loans} signatories={signatories} selectedOffice = {selectedOffice} periodFrom = {periodFrom} periodTo = {periodTo} user = {user}/>
            </div>
        </Box>
    )
}