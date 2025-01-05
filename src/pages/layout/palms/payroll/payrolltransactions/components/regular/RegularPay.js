import { Button, Grid, Paper, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { getDeptPayData, getDeptPaySetupData } from '../../PayrollTransactionsRequests';
import { api_url } from '../../../../../../../request/APIRequestURL';
import { APIError, formatTwoDateToText, formatTwoDateToTextPayroll, StyledTableCellPayroll } from '../../../../../customstring/CustomString';
import { RegularPrint } from '../../../setuppayroll/components/forms/regular/RegularPrint';
import { auditLogs } from '../../../../../auditlogs/Request';
import ReactToPrint,{useReactToPrint} from 'react-to-print';
import PrintIcon from '@mui/icons-material/Print';
import '../../.././setuppayroll/components/forms/regular/RegularPrint.css';
import Swal from 'sweetalert2';
import { APILoading } from '../../../../../apiresponse/APIResponse';
export const RegularPay = ({loanType,signatories,user}) => {
    const [paySetupData,setPaySetupData] = useState([])
    const [office,setOffice] = useState(null)
    const [data,setData] = useState([]);
    const [loans,setLoans] = useState(null)
    const [selectedPayroll,setSelectedPayroll] = useState()
    const [deptTitle,setDeptTitle] = useState('')
    useEffect(()=>{
        //get all finalized payroll
        _init();
    },[])
    const _init = async () => {
        // const res = await getDeptPayData();
        // console.log(res.data.data)
        let t_data = {
            emp_status:'RE'
        }
        const res = await getDeptPaySetupData(t_data);
        console.log(res.data.data)
        setPaySetupData(res.data.data)
        setDeptTitle(res.data.dept)
        
    }
    const handleViewPay = async (item) => {
        setSelectedPayroll(item)
        try{
            APILoading('info','Loading payroll data','Please wait...')
            let t_data = {
                payroll_no:item.payroll_no,
                payroll_group_id:item.payroll_group_id
            }
            const res = await getDeptPayData(t_data)
            setData(res.data.data)
        
            var loans = res.data.data.filter(el => {
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
            const unique_loans = [...new Set(loans_arr.map(item => item.loan_abbr))];
            setLoans(unique_loans)
            // console.log(unique_loans)
            Swal.close()
            beforePrint()
        }catch(err){
            APIError(err)
        }
        console.log(item)
    }
    const printPayroll = useRef();
    const reactToPrintPayroll  = useReactToPrint({
        content: () => printPayroll.current,
        documentTitle:'Payroll'
    });
    const beforePrint = () => {
        // var logs = {
        //     action:'PRINT PAYROLL',
        //     action_dtl:'REGULAR - '+'FROM:'+periodFrom+'| TO:'+periodTo,
        //     module:'PAYROLL'
        // }
        // auditLogs(logs)
        reactToPrintPayroll()
        
        // console.log(moment(new Date()).format('MM/DD/YYYY h:mm: a'))
    }
    return (
        <Grid container>
            <Grid item xs={12}>
                <Paper>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCellPayroll>
                                        Payroll No
                                    </StyledTableCellPayroll>
                                    <StyledTableCellPayroll>
                                        Group Name
                                    </StyledTableCellPayroll>
                                    <StyledTableCellPayroll>
                                        Period Covered
                                    </StyledTableCellPayroll>
                                    <StyledTableCellPayroll>
                                        Year
                                    </StyledTableCellPayroll>
                                    
                                    <StyledTableCellPayroll>
                                        
                                    </StyledTableCellPayroll>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    paySetupData.length>0
                                    ?
                                        paySetupData.map((item)=>{
                                            return (
                                                <TableRow key={item.payroll_no}>
                                                    <StyledTableCellPayroll>
                                                        {item.payroll_no}
                                                    </StyledTableCellPayroll>
                                                    <StyledTableCellPayroll>
                                                        {item.sub_name}
                                                    </StyledTableCellPayroll>
                                                    <StyledTableCellPayroll>
                                                        {formatTwoDateToTextPayroll(item.period_from,item.period_to)}
                                                    </StyledTableCellPayroll>
                                                    <StyledTableCellPayroll>                                                        {item.year}
                                                    </StyledTableCellPayroll>
                                                    <StyledTableCellPayroll align='center'>
                                                    <Button size='small' variant='contained' className='custom-roundbutton' onClick={()=>handleViewPay(item)} startIcon={<PrintIcon/>}>Print Payroll</Button>
                                                    </StyledTableCellPayroll>
                                                </TableRow>
                                            )
                                        })
                                    :
                                    <StyledTableCellPayroll colSpan={6} align='center'>
                                        No Data
                                    </StyledTableCellPayroll>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
            <div style={{display:'none'}}>
                <RegularPrint ref={printPayroll} empList = {data} loans = {loans} signatories={signatories} selectedOffice = {selectedPayroll} periodFrom = {selectedPayroll?.period_from} periodTo = {selectedPayroll?.period_to} user={user}/>
            </div>
        </Grid>
    )
}