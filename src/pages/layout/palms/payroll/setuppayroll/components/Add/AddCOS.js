import React, { useEffect, useRef, useState } from "react";
import { Box, Grid, Autocomplete, TextField, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, TableFooter, Typography, IconButton, Tooltip } from "@mui/material";
import { getDeptPayroll, getNewPayGroup, getPayrollGroup, postPayroll } from "../../SetupPayrollRequests";
import { APIError, APISuccess, compLateUT, formatExtName, formatMiddlename, formatTwoDateToText, formatTwoDateToTextPayroll, formatWithCommas, isNumeric, truncateToDecimals } from "../../../../../customstring/CustomString";
import SendIcon from '@mui/icons-material/Send';
import Swal from "sweetalert2";
import { APILoading } from "../../../../../apiresponse/APIResponse";
import { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { blue, green, grey, orange, red } from "@mui/material/colors";
import PaginateCard from "../../../../../selfserviceportal/leaveapplication/Card/PaginateCard";
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import SaveIcon from '@mui/icons-material/Save';
import SmallModal from "../../../../../custommodal/SmallModal";
import SmallestModal from "../../../../../custommodal/SmallestModal";
import { CasualPrint } from "../forms/casual/CasualPrint";
import { auditLogs } from "../../../../../auditlogs/Request";
import ReactToPrint,{useReactToPrint} from 'react-to-print';
import PrintIcon from '@mui/icons-material/Print';
import { getPayGroup } from "../../../../../customprocessdata/CustomProcessData";
import EditIcon from '@mui/icons-material/Edit';
import { UpdateWTax } from "../modal/UpdateWTax";
import { COSPrint } from "../forms/cos/COSPrint";
import moment from "moment";
import axios from "axios";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
[`&.${tableCellClasses.head}`]: {
    backgroundColor: blue[800],
    color: theme.palette.common.white,
    fontSize:'.7rem',
    padding:5,
    zIndex:1
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
export const AddCOS = ({offices,selectedPaySetup}) =>{
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
    const [empStatus,setEmpStatus] = useState('COS')
    const [user,setuser] = useState('')
    const [anchorEl, setAnchorEl] = useState([]);
    const [anchorElEmpAction, setAnchorElEmpAction] = useState([]);

    const [wTax,setWTax] = useState([])
    useEffect(()=>{
        _getPayDept()
    },[])
    const _getPayDept = async () => {
        let t_data = {
                category:3,
                pay_no:927
        }
        const res = await getNewPayGroup(t_data)
        console.log(res.data)
    }
    const handleProceed = async (e)=>{
        e.preventDefault();
        if(selectedOffice){
            APILoading('info','Loading Data','Please wait...')
            let dtr_from = moment(selectedPaySetup.period_from).format('YYYY-MM-DD');
            let dtr_to = moment(selectedPaySetup.period_to).format('YYYY-MM-DD');
            let period_from = selectedPaySetup.period_from;
            let period_to = selectedPaySetup.period_to;

            let t_data = {
                dept_code:selectedOffice.dept_code,
                emp_status:empStatus,
                dtr_from:dtr_from,
                dtr_to:dtr_to,
                period_from:period_from,
                period_to:period_to,
                group_no:selectedPayrollGroup.group_no,
                deduction:selDeducType.val?selDeducType.val:0,
                pay_setup:selectedPaySetup
            }
            console.log(t_data)
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

            //get different with holding tax
            const diff_wtax = res.data.emp_list.filter(el=>el.fixed_tax !== null).map(el2=>el2.fixed_tax);
            const unique_wtax = [...new Set(diff_wtax)];
            setWTax(unique_wtax.sort())


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
            var mratetable = table;
            var absenttable = table;
            var latehrstable = table;
            var lateminstable = table;
            var latetotaltable = table;
            var wtaxtable = table;
            var peratable = table;
            var gsispertable = table;
            var gsisgovtable = table;
            var accruedtable = table;
            var pagibigpertable = table;
            var ssstable = table;
            var phpertable = table;
            var phgovtable = table;
            var contritable = table;
            var amountduetable = table;

            //monthly salary
            let msalarytable_arr = Array.from(msalarytable.rows)

            msalarytable_arr.splice(msalarytable_arr.length-1,1)

            let monthlySubTotal = msalarytable_arr.slice(2).reduce((total,row) => {
                var rem_commas = (row.cells[3]?.innerHTML).replace(',','');
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
                
            }, 0);

            //end monthly salary

            //rate salary
            let mratetable_arr = Array.from(mratetable.rows)

            mratetable_arr.splice(mratetable_arr.length-1,1)

            let rateSubTotal = mratetable_arr.slice(2).reduce((total,row) => {
                var rem_commas = (row.cells[4]?.innerHTML).replace(',','');
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
                
            }, 0);

            //end rate salary

            //start absent days
            let absenttable_arr = Array.from(absenttable.rows)

            absenttable_arr.splice(absenttable_arr.length-1,1)

            let absentSubTotal = absenttable_arr.slice(2).reduce((total,row) => {
                var rem_commas = (row.cells[6]?.innerHTML).replace(',','');
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
                
            }, 0);

            //end absent days

            //start late hours
            let latehrstable_arr = Array.from(latehrstable.rows)

            latehrstable_arr.splice(latehrstable_arr.length-1,1)

            let lateHrsSubTotal = latehrstable_arr.slice(2).reduce((total,row) => {
                var rem_commas = (row.cells[7]?.innerHTML).replace(',','');
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
                
            }, 0);

            //end late hours

            //start late mins
            let lateminstable_arr = Array.from(lateminstable.rows)

            lateminstable_arr.splice(lateminstable_arr.length-1,1)

            let lateMinsSubTotal = lateminstable_arr.slice(2).reduce((total,row) => {
                var rem_commas = (row.cells[8]?.innerHTML).replace(',','');
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
                
            }, 0);

            //end late mins

            //start late total
            let lateTotalSubTotal = empList.slice((page-1)*rowsPerPage,(page-1)*rowsPerPage+rowsPerPage).filter(el=>el.total_wopay>0).map(el2=>el2.total_wopay).reduce((total,row) => {
                return total + row;
            }, 0);

            //end late total

            //start accrued
            let accruedtable_arr = Array.from(accruedtable.rows)

            accruedtable_arr.splice(accruedtable_arr.length-1,1)

            let accruedSubTotal = accruedtable_arr.slice(2).reduce((total,row) => {
                var rem_commas = (row.cells[11]?.innerHTML).replace(',','');
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
                
            }, 0);

            //end accrued



            //withholding tax
            let wtaxtable_arr = Array.from(wtaxtable.rows)

            wtaxtable_arr.splice(wtaxtable_arr.length-1,1)

            let taxSubTotal = wtaxtable_arr.slice(2).reduce((total,row) => {
                var rem_commas = (row.cells[6]?.innerHTML).replace(',','');
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
                
            }, 0);

            //end withholding tax
            

            //GSIS personal share

            let gsispertable_arr = Array.from(gsispertable.rows)

            gsispertable_arr.splice(gsispertable_arr.length-1,1)

            let gsisPerSubTotal = gsispertable_arr.slice(2).reduce((total,row) => {
                var rem_commas = (row.cells[7]?.innerHTML).replace(',','');
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
            
            }, 0);
            // End GSIS personal share

            //GSIS gov't share
            let gsisgovtable_arr = Array.from(gsisgovtable.rows)

            gsisgovtable_arr.splice(gsisgovtable_arr.length-1,1)

            let gsisGovSubTotal = gsisgovtable_arr.slice(2).reduce((total,row) => {
                var rem_commas = (row.cells[8].innerHTML).replace(',','');
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
            }, 0);
            //End GSIS gov't share

            

            //PAGIBIG personal share

            let pagibigpertable_arr = Array.from(pagibigpertable.rows)

            pagibigpertable_arr.splice(pagibigpertable_arr.length-1,1)

            let pagibigPerSubTotal = pagibigpertable_arr.slice(2).reduce((total,row) => {
                var rem_commas = (row.cells[12]?.innerHTML).replace(',','');
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
            
            }, 0);
            // End PAGIBIG personal share

            //PAGIBIG gov share

            let ssstable_arr = Array.from(ssstable.rows)

            ssstable_arr.splice(ssstable_arr.length-1,1)

            let sssSubTotal = ssstable_arr.slice(2).reduce((total,row) => {
                var rem_commas = (row.cells[14]?.innerHTML).replace(',','');
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
            
            }, 0);
            // End PAGIBIG gov share


            //PHILHEALTH personal share

            let phpertable_arr = Array.from(phpertable.rows)

            phpertable_arr.splice(phpertable_arr.length-1,1)

            let phPerSubTotal = phpertable_arr.slice(2).reduce((total,row) => {
                var rem_commas = (row.cells[15]?.innerHTML).replace(',','');
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
            
            }, 0);
            // End PHILHEALTH personal share

            //PHILHEALTH gov share

            let phgovtable_arr = Array.from(phgovtable.rows)

            phgovtable_arr.splice(phgovtable_arr.length-1,1)

            let phGovSubTotal = phgovtable_arr.slice(2).reduce((total,row) => {
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

            //Total Contri

            let contritable_arr = Array.from(contritable.rows)

            contritable_arr.splice(contritable_arr.length-1,1)

            let totalContriSubTotal = contritable_arr.slice(2).reduce((total,row) => {
                var rem_commas = (row.cells[18+wTax.length]?.innerHTML).replace(',','');
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
            
            }, 0);

            // End Total Contri

            //Total Amount Due

            let amountdue_arr = Array.from(amountduetable.rows)

            amountdue_arr.splice(amountdue_arr.length-1,1)

            let amountDueSubTotal = amountdue_arr.slice(2).reduce((total,row) => {
                var rem_commas = (row.cells[19+wTax.length]?.innerHTML).replace(',','');
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
            
            }, 0);

            // End Total Amount Due


            

            
            // const total = empList.map((item) => item.m_salary)
            //     .reduce((a, b) =>  a + b, 0);
            //   console.log(total);

            //Update footer td value
            document.getElementById("m-salary-total").innerHTML = formatWithCommas(monthlySubTotal.toFixed(2));
            document.getElementById("m-rate-total").innerHTML = formatWithCommas(rateSubTotal.toFixed(2));
            document.getElementById("a-days-total").innerHTML = absentSubTotal>0?formatWithCommas(absentSubTotal.toFixed(2)):'';
            document.getElementById("late-hrs-total").innerHTML = lateHrsSubTotal>0?formatWithCommas(lateHrsSubTotal.toFixed(2)):'';
            document.getElementById("late-mins-total").innerHTML = lateMinsSubTotal>0?formatWithCommas(lateMinsSubTotal.toFixed(2)):'';
            document.getElementById("late-total").innerHTML = lateTotalSubTotal>0?formatWithCommas(lateTotalSubTotal.toFixed(2)):'';
            document.getElementById("accrued-total").innerHTML = formatWithCommas(accruedSubTotal.toFixed(2));
            document.getElementById("pagibig-personal-total").innerHTML = formatWithCommas(pagibigPerSubTotal.toFixed(2));
            document.getElementById("sss-total").innerHTML = formatWithCommas(sssSubTotal.toFixed(2));
            document.getElementById("ph-personal-total").innerHTML = formatWithCommas(phPerSubTotal.toFixed(2));
            // document.getElementById("ph-gov-total").innerHTML = formatWithCommas(phGovSubTotal.toFixed(2));
            document.getElementById("contri-total").innerHTML = formatWithCommas(totalContriSubTotal.toFixed(2));
            document.getElementById("amount-due-total").innerHTML = formatWithCommas(amountDueSubTotal.toFixed(2));
            // document.getElementById("30thpay-total").innerHTML = formatWithCommas(pay30thSubTotal.toFixed(2));
        }
        
    },[empList,page,loans])
    const loansCell = () =>{
        const col_num = Math.floor(loans.length/3)+(loans.length%3 === 0?0:1);
        const cols = [];
        let col_page = 1;
        let col_per_page = 3;
        for(let i=0;i<col_num;i++){
            cols.push(<TableCell rowSpan={2}>
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
                </TableCell>
            )
            col_page++;
        }
        if(col_num>0){
            return (
                <>{cols}</>
            )
        }else{
            return <TableCell rowSpan={2}></TableCell>
        }

    }
    const loansCellFooter = () =>{
        const col_num = Math.floor(loans.length/3)+(loans.length%3 === 0?0:1);
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
    const handleUpdateWTax = (item) => {
        console.log(item)
    }
    const taxCell = () =>{
        let cols =[];
        for(let i=0;i<wTax.length;i++){
            cols.push(<StyledTableCell align="center">
                {wTax[i]}%
                </StyledTableCell>
            )
        }
        return (
            <>{cols}</>
        )

    }
    const taxCellFooter = () =>{
        let cols =[];
        for(let i=0;i<wTax.length;i++){
            cols.push(<StyledTableCell>
                </StyledTableCell>
            )
        }
        return (
            <>{cols}</>
        )

    }
    const checkTaxCells = (item) =>{
        let cols =[];
        for(let i=0;i<wTax.length;i++){
            if(item.fixed_tax !== null){
                if(item.fixed_tax === wTax[i]){
                    cols.push(<StyledTableCell align="center">
                        {item.tax>0?formatWithCommas((item.tax).toFixed(2)):''}
                        </StyledTableCell>
                    )
                }else{
                    cols.push(<StyledTableCell>
                        </StyledTableCell>
                    )
                }
            }else{
                cols.push(<StyledTableCell>
                    </StyledTableCell>
                )
            }
            
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
        // var table_arr = Array.from(table.rows).slice(2)
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
            action_dtl:'COS - '+'FROM:'+periodFrom+'| TO:'+periodTo,
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
    const [openUpdateWTax,setOpenUpdateWTax] = useState(false);
    const [selectedData,setSelectedData] = useState([])
    const handleOpenUpdateWTax = (item) => {
        setSelectedData(item)
        setOpenUpdateWTax(true)
    }
    const handleSaveOnly = async ()=>{
        try{
            APILoading('info','Saving payroll data','Please wait...')
            let t_data = {
                payroll_group_id:selectedPayrollGroup.payroll_group_id,
                group_name:selectedPayrollGroup.group_name,
                group_subname:selectedPayrollGroup.sub_name,
                payroll_no:selectedPaySetup.payroll_no,
                payroll_setup_id:selectedPaySetup.payroll_setup_id,
                data:empList,
                period_from:periodFrom,
                period_to:periodTo,
                year:selectedPaySetup.year,
                signatories:signatories
            }
            console.log(t_data)
            const res = await postPayroll(t_data);

            if(res.data.status === 200){
                APISuccess(res.data.message)
            }else{
                APIError(res.data.message)
            }
        }catch(err){
            APIError(err)
        }
    }
    const [selDeducType,setSelDeductType] = useState({
        val:0,
        type:'None'
    });
    const [deductType,setDeductType] = useState([{
        val:0,
        type:'None'
    },{
        val:1,
        type:'Single'
    },{
        val:2,
        type:'Double'
    }])
    const [points, setPoints] = useState({
        x: 0,
        y: 0,
    });
    const [selectedEmpDefault,setSelectedEmpDefault] = useState({})
    const handleEditRow = (item) => {
        let temp = [...empList];
        const index = temp.findIndex(el=>el.emp_no === item.emp_no);
        temp[index].editable = true;
        setEmpList(temp)
    }
    const handleCloseRow = (item,e) => {
        let temp = [...empList];
        const index = temp.findIndex(el=>el.employee_id === item.employee_id);
        temp[index].editable = false;
        handleCloseEmpAction(item.employee_id,e)
        setEmpList(temp)
        
    }
    const handleUpdateRow = (name,item,val) => {
        let temp = {...selectedEmpDefault};
        // const index = temp.findIndex(el=>el.emp_no === item.emp_no);
        temp[name] = val.target.value;
        setSelectedEmpDefault(temp)
    }
    const handleClickEmpAction = (id,event,item) => {
        event.preventDefault();
        setPoints({
            x: event.clientX+ 2,
            y: event.clientY-6,
        });
        let temp = [...anchorElEmpAction];
        temp[id] = event.currentTarget
        setAnchorElEmpAction(temp);
    };
    const handleCloseEmpAction = (id,event) => {
        let temp = [...anchorElEmpAction];
        temp[id] = null
        setAnchorElEmpAction(temp);
    };
    const handleSaveEdit = async (item,event) => {
        handleCloseEmpAction(item.employee_id,event)
        try{
            let temp = [...empList];
            const index = temp.findIndex(el=>el.employee_id === item.employee_id);
            temp[index] = selectedEmpDefault;
            temp[index].editable = false;
            if(selectedPaySetup.period_to.includes('15')){
                temp[index].amount_15 = parseFloat(selectedEmpDefault.adjust_amount?selectedEmpDefault.adjust_amount:0)+parseFloat(selectedEmpDefault.amount_15);
            }else{
                temp[index].amount_30 = parseFloat(selectedEmpDefault.adjust_amount?selectedEmpDefault.adjust_amount:0)+parseFloat(selectedEmpDefault.amount_30);
            }
            console.log(temp)
            setEmpList(temp)
        }catch(err){
            APIError(err)
        }

    }
    const handleCancelEdit = (item,event) =>{
        handleCloseRow(item,event)
    }
    const handleClearPayroll = async (item,e) =>{
        try{
            APILoading('info','Clearing payroll','Please wait...');
            let temp = {...item}
            console.log(item)
            temp.adjust_amount = 0;
            temp.amount_adjust = 0;
            temp.wopay_hours = 0;
            temp.wopay_minutes = 0;
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
            // const res = await savePayrollUpdate({data:temp});
            // if(res.data.status === 200){
            //     setData(res.data.data)
            //     APISuccess(res.data.message)
            //     setEditData(false)
            //     handleCloseEmpAction(item.employee_id,e)
            // }else{
            //     APIError(res.data.message)
            // }
        }catch(err){
            APIError(err)
        }
    }
    const handleEditEmpAction = (item,e) => {
        console.log(item)
        let temp = [...empList];
        const index = temp.findIndex(el=>el.employee_id === item.employee_id);
        temp[index].editable = true;
        // setData(temp)
        setEmpList(temp)
        // setSelectedEmp(item);
        setSelectedEmpDefault(item)
        handleCloseEmpAction(item.employee_id,e)
    }
    const handleDeleteEmpAction = async (item,e) => {
        Swal.fire({
            icon:'question',
            title:'Confirm Delete from List ?',
            showCancelButton:true,
            confirmButtonText:'Yes, I confirm',
            cancelButtonText:'No'
        }).then(async res=>{
            if(res.isConfirmed){
                try{
                    APILoading('info','Deleting Employee from Payroll','Please wait...')
                    let t_data = {
                        employee_id:item.employee_id,
                        payroll_group_id:item.payroll_group_id,
                        period_from:item.period_from,
                        period_to:item.period_to,
                        emp_status:item.emp_status,
                        payroll_no:item.payroll_no
                    };
                    // const res = await deleteEmpPayroll(t_data);
                    // if(res.data.status === 200){
                    //     setPayrollGroupData(res.data.group_data)
                    //     setData(res.data.data)
                    //     APISuccess(res.data.message)
                    // }else{
                    //     APIError(res.data.message)
                    // }
                }catch(err){
                    APIError(err)
                }
                
            }
        })
        handleCloseEmpAction(item.employee_id,e)
    }
    useEffect(()=>{
        let val_days = compLateUT('days',selectedEmpDefault.m_salary)*selectedEmpDefault.wopay_days
        let val_hours = compLateUT('hours',selectedEmpDefault.m_salary)*selectedEmpDefault.wopay_hours
        let val_minutes = compLateUT('minutes',selectedEmpDefault.m_salary)*selectedEmpDefault.wopay_minutes
        setSelectedEmpDefault({
            ...selectedEmpDefault,
            total_wopay:val_days+val_hours+val_minutes
        })

    },[selectedEmpDefault?.wopay_days,selectedEmpDefault?.wopay_hours,selectedEmpDefault?.wopay_minutes])
    return (
        <Box sx={{maxHeight:'90vh',overflow:'auto',p:1}}>
            <Grid container spacing = {1} sx={{pt:1}} id ='payroll-div'>
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
                    isOptionEqualToValue={(option, value) => option.group_name === value.group_name }

                    sx={{ width: 500 }}
                    // fullWidth
                    size="small"
                    value = {selectedPayrollGroup}
                    onChange={(event,newValue)=>{
                        setSelectedPayrollGroup(newValue)
                    }}
                    renderInput={(params) => <TextField {...params} label="Payroll Group" required/>}
                    />
                <Autocomplete
                    disablePortal
                    id="combo-box-d-type"
                    options={deductType}
                    getOptionLabel={(option) => option.type}
                    isOptionEqualToValue={(option, value) => option.val === value.val }
                    sx={{ width: 400 }}
                    // fullWidth
                    size="small"
                    value = {selDeducType}
                    onChange={(event,newValue)=>{
                        setSelDeductType(newValue)
                    }}
                    renderInput={(params) => <TextField {...params} label="Cont. Deduction" required/>}
                    />
                    {/* <TextField label='Period Covered' value={formatTwoDateToText(selectedPaySetup.period_from,selectedPaySetup.period_to)}InputProps={{readOnly:true}} size="small" sx={{minWidth:190}}/>
                    <TextField label='Year' value = {selectedPaySetup.year} InputProps={{readOnly:true}} size="small"/> */}
                    {/* <TextField type="date" label='Period From' value={periodFrom} onChange={(val)=>setPeriodFrom(val.target.value)} InputLabelProps={{shrink:true}} required sx={{width:280}} size="small"/>
                    <TextField type="date" label='Period To' value={periodTo} onChange={(val)=>setPeriodTo(val.target.value)} InputLabelProps={{shrink:true}} required sx={{width:280}} size="small"/> */}
                    <Button variant="contained" className='custom-roundbutton' type="submit" sx={{width:200}}>Proceed</Button>
                    {
                        empList.length>0
                        ?
                        // <Button onClick={beforePrint} variant="outlined" startIcon={<PrintIcon/>} sx={{width:180}}>Print</Button>
                        <Button onClick={handleSaveOnly} variant="contained" color="success" className="custom-roundbutton" sx={{pl:5,pr:5}}>Save</Button>
                        :
                        ''
                    }
                </form>

                </Grid>
                <Grid item xs={12}>
                    <Paper>
                        <TableContainer sx={{maxHeight:'70vh'}}>
                            <Table id = 'setup-payroll-table'>
                                <TableHead sx={{position:'sticky',top:0,background:'#fff',zIndex:1}}>
                                    <TableRow>
                                        <StyledTableCell align="center" rowSpan={2}>
                                            {/* No. */}
                                        </StyledTableCell>
                                        <StyledTableCell align="center" rowSpan={2}>
                                            Employee Name
                                        </StyledTableCell>
                                        <StyledTableCell align="center" rowSpan={2}>
                                            Position
                                        </StyledTableCell>
                                        <StyledTableCell align="center" rowSpan={2}>
                                            Salary Rate
                                        </StyledTableCell>
                                        <StyledTableCell align="center" rowSpan={2}>
                                            {formatTwoDateToTextPayroll(periodFrom,periodTo)}
                                        </StyledTableCell>
                                        <StyledTableCell align="center" rowSpan={2}>
                                            No. of<br/>Days
                                        </StyledTableCell>
                                        <StyledTableCell align="center" rowSpan={2}>
                                            Absent<br/> Days
                                        </StyledTableCell>
                                         <StyledTableCell align="center" rowSpan={2}>
                                            Late/UT <br/> (hrs.)
                                        </StyledTableCell>
                                        <StyledTableCell align="center" rowSpan={2}>
                                            Late/UT <br/> (mins.)
                                        </StyledTableCell>
                                        <StyledTableCell align="center" rowSpan={2}>
                                            Total <br/>
                                            Late/UT <br/>
                                            (Deduction)
                                        </StyledTableCell>
                                        <StyledTableCell align="center" rowSpan={2}>
                                            Adj. <br/>
                                            Amount
                                        </StyledTableCell>
                                        <StyledTableCell align="center" rowSpan={2}>
                                            Amount Accrued
                                        </StyledTableCell>
                                        <StyledTableCell align="center" rowSpan={2}>
                                            Pag-Ibig
                                        </StyledTableCell>
                                        <StyledTableCell align="center" rowSpan={2}>
                                            Pag-Ibig <br/>
                                            MP2
                                        </StyledTableCell>
                                        <StyledTableCell align="center" rowSpan={2}>
                                            SSS
                                        </StyledTableCell>
                                        <StyledTableCell align="center" rowSpan={2}>
                                            PHIC
                                        </StyledTableCell>
                                        <StyledTableCell align="center" rowSpan={2}>
                                            1% PHIC <br/>
                                            Differential
                                        </StyledTableCell>
                                        <StyledTableCell align="center" colSpan={wTax.length+1}>
                                            Withholding Tax
                                        </StyledTableCell>
                                        <StyledTableCell align="center" rowSpan={2}>
                                            Total
                                        </StyledTableCell>
                                        <StyledTableCell align="center" rowSpan={2}>
                                            Amount <br/>
                                            Due
                                        </StyledTableCell>
                                    </TableRow>
                                    <TableRow>
                                        {taxCell()}
                                        <StyledTableCell>
                                        </StyledTableCell>
                                    </TableRow>
                                    
                                </TableHead>
                                <TableBody>
                                    {
                                        empList&&empList.slice((page-1)*rowsPerPage,(page-1)*rowsPerPage+rowsPerPage).map((item,key)=>{
                                        return(
                                            <TableRow key={item.id} hover onContextMenu={(e)=>handleClickEmpAction(item.employee_id,e,item)}
                                                            id={item.employee_id}
                                                            aria-controls={Boolean(item.employee_id)}
                                                            aria-haspopup="true"
                                                            aria-expanded={Boolean(item.employee_id)}>
                                                <StyledTableCell>
                                                    {/* {
                                                        item.editable
                                                        ?
                                                        <Button variant="contained" size="small" color="error" className="custom-roundbutton" sx={{width:100}} startIcon={<CloseIcon size='small'/>} onClick={()=>handleCloseRow(item)}>Close</Button>
                                                        :
                                                        <Button variant="contained" size="small" className="custom-roundbutton" sx={{width:100}} startIcon={<EditIcon size='small'/>} onClick={()=>handleEditRow(item)}>Edit</Button>

                                                    } */}
                                                    
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                {`${item.lname}, ${item.fname} ${formatMiddlename(item.mname)} ${formatExtName(item.extname)}`}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {item.position_name}
                                                </StyledTableCell>
                                                <StyledTableCell align="right" sx={{color:green[800]}}>
                                                    {formatWithCommas(parseFloat(item.m_salary).toFixed(2))}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    { 
                                                        selectedPaySetup.period_to.includes('15')
                                                        ?
                                                        formatWithCommas(parseFloat(item.earned_15).toFixed(2))
                                                        :
                                                        formatWithCommas(parseFloat(item.earned_30).toFixed(2))
                                                    }
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    {
                                                        item.editable
                                                        ?
                                                        <TextField type='number' size="small" sx={{width:70}} value = {selectedEmpDefault.no_days} onChange={(val)=>handleUpdateRow('no_days',item,val)}/>
                                                        :
                                                        formatWithCommas(parseFloat(item.no_days).toFixed(2))
                                                    }
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    {
                                                        item.editable
                                                        ?
                                                        <TextField type='number' size="small" sx={{width:60}} value = {selectedEmpDefault.wopay_days} onChange={(val)=>handleUpdateRow('wopay_days',item,val)}/>
                                                        :
                                                        item.wopay_days>0?item.wopay_days:'-'
                                                    }
                                                    {/* {item.wopay_days>0?item.wopay_days:'-'} */}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    {
                                                        item.editable
                                                        ?
                                                        <TextField type='number' size="small" sx={{width:60}} value = {selectedEmpDefault.wopay_hours} onChange={(val)=>handleUpdateRow('wopay_hours',item,val)}/>
                                                        :
                                                        item.wopay_hours>0?item.wopay_hours:'-'
                                                    }
                                                    {/* {item.wopay_hours>0?item.wopay_hours:'-'} */}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    {
                                                        item.editable
                                                        ?
                                                        <TextField type='number' size="small" sx={{width:60}} value = {selectedEmpDefault.wopay_minutes} onChange={(val)=>handleUpdateRow('wopay_minutes',item,val)}/>
                                                        :
                                                        item.wopay_minutes>0?item.wopay_minutes:'-'
                                                    }
                                                    {/* {item.wopay_minutes>0?item.wopay_minutes:'-'} */}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <Box sx={{display:'flex',flexDirection:"row",justifyContent:'space-between',alignItems:'center'}}>
                                                    {
                                                        item.editable
                                                        ?
                                                        formatWithCommas(parseFloat(selectedEmpDefault.total_wopay).toFixed(2))
                                                        :
                                                        item.total_wopay>0
                                                        ?
                                                        <span>{formatWithCommas(parseFloat(item.total_wopay).toFixed(2))}</span>
                                                        :
                                                        '-'
                                                    }
                                                    </Box>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    -
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    {
                                                        formatWithCommas(parseFloat((item.m_salary/2)-item.total_wopay).toFixed(2))
                                                    }
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    {
                                                        item.editable
                                                        ?
                                                        <TextField type='number' size="small" sx={{width:80}} value = {selectedEmpDefault.pagibig} onChange={(val)=>handleUpdateRow('pagibig',item,val)}/>
                                                        :
                                                        formatWithCommas(parseFloat(item.pagibig).toFixed(2))

                                                    }
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    -
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    {
                                                        item.editable
                                                        ?
                                                        <TextField type='number' size="small" sx={{width:80}} value = {selectedEmpDefault.sss} onChange={(val)=>handleUpdateRow('sss',item,val)}/>
                                                        :
                                                        formatWithCommas(parseFloat(item.sss).toFixed(2))

                                                    }
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    {
                                                        item.editable
                                                        ?
                                                        <TextField type='number' size="small" sx={{width:80}} value = {selectedEmpDefault.ph_personal_share} onChange={(val)=>handleUpdateRow('ph_personal_share',item,val)}/>
                                                        :
                                                        formatWithCommas(parseFloat(item.ph_personal_share).toFixed(2))
                                                    }
                                                    
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    -
                                                </StyledTableCell>
                                                {checkTaxCells(item)}
                                                <StyledTableCell align="center">
                                                    <Tooltip title='Update Tax Percentage'><IconButton size="small" color="success" onClick={()=>handleOpenUpdateWTax(item)}><EditIcon/></IconButton></Tooltip>
                                                </StyledTableCell>
                                                {/* <StyledTableCell align="right">
                                                    {item.tax>0?formatWithCommas((item.tax).toFixed(2)):''}
                                                </StyledTableCell> */}
                                                <StyledTableCell align="right">
                                                    {formatWithCommas(item.tot_contri.toFixed(2))}
                                                </StyledTableCell>

                                                <StyledTableCell align="right">
                                                    {
                                                        formatWithCommas((parseFloat((item.m_salary/2)-item.total_wopay)-parseFloat(item.tot_contri)).toFixed(2))
                                                    }

                                                </StyledTableCell>
                                                {
                                                    item.editable
                                                    ?
                                                    <Menu
                                                        id={item.employee_id}
                                                        anchorEl={anchorElEmpAction[item.employee_id]}
                                                        open={Boolean(anchorElEmpAction[item.employee_id])}
                                                        onClose={(e)=>handleCloseEmpAction(item.employee_id,e)}
                                                        anchorReference="anchorPosition"
                                                        anchorPosition={{ top: points.y, left: points.x }}
                                                    >
                                                    <MenuItem onClick={(e)=>handleSaveEdit(item,e)} size='small'>
                                                        <ListItemIcon color="success">
                                                            <SaveIcon color="success" fontSize="small" />
                                                        </ListItemIcon>
                                                        <ListItemText>Save</ListItemText>
                                                    </MenuItem>
                                                    <MenuItem onClick={(e)=>handleCancelEdit(item,e)} size='small'>
                                                        <ListItemIcon color="success">
                                                            <ClearIcon sx={{color:red[800]}} fontSize="small" />
                                                        </ListItemIcon>
                                                        <ListItemText>Cancel</ListItemText>
                                                    </MenuItem>
                                                    </Menu>
                                                    :
                                                    <Menu
                                                        id={item.employee_id}
                                                        anchorEl={anchorElEmpAction[item.employee_id]}
                                                        open={Boolean(anchorElEmpAction[item.employee_id])}
                                                        onClose={(e)=>handleCloseEmpAction(item.employee_id,e)}
                                                        anchorReference="anchorPosition"
                                                        anchorPosition={{ top: points.y, left: points.x }}
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
                                                }
                                            </TableRow>
                                        )
                                    })
                                    }
                                </TableBody>
                                <TableFooter sx={{position:'sticky',bottom:0,background:'#fff'}}>
                                    <TableRow>
                                        <StyledTableCell colSpan={3}>Page Total</StyledTableCell>
                                        <StyledTableCell id ='m-salary-total' align="right"></StyledTableCell>
                                        <StyledTableCell id ='m-rate-total'></StyledTableCell>
                                        <StyledTableCell></StyledTableCell>
                                        <StyledTableCell id='a-days-total' align="right"></StyledTableCell>
                                        <StyledTableCell id='late-hrs-total' align="right"></StyledTableCell>
                                        <StyledTableCell id='late-mins-total' align="right"></StyledTableCell>
                                        <StyledTableCell id='late-total' align="right"></StyledTableCell>
                                        {/* <StyledTableCell id = 'ecc-total' align="right"></StyledTableCell> */}
                                        <StyledTableCell align="right"></StyledTableCell>
                                        <StyledTableCell id = 'accrued-total' align="right"></StyledTableCell>
                                        <StyledTableCell id = 'pagibig-personal-total' align="right"></StyledTableCell>
                                        <StyledTableCell align="right"></StyledTableCell>
                                        <StyledTableCell id = 'sss-total' align="right"></StyledTableCell>
                                        <StyledTableCell id = 'ph-personal-total' align="right"></StyledTableCell>
                                        <StyledTableCell></StyledTableCell>
                                        {taxCellFooter()}
                                        <StyledTableCell></StyledTableCell>
                                        <StyledTableCell id = 'contri-total' align="right"></StyledTableCell>
                                        <StyledTableCell id = 'amount-due-total' align="right"></StyledTableCell>

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
                <SmallestModal open = {openUpdateWTax} close = {()=>setOpenUpdateWTax(false)} title='Updating Tax Percentage'>
                    <UpdateWTax close = {()=>setOpenUpdateWTax(false)} selectedData = {selectedData}/>
                </SmallestModal>

            </Grid>
            <div style={{display:'none'}}>
                <COSPrint ref={printPayroll} empList = {empList} loans = {loans} signatories={signatories} selectedOffice = {selectedOffice} periodFrom = {periodFrom} periodTo = {periodTo} wTax={wTax} user = {user}/>
            </div>
        </Box>
    )
}