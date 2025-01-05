import { useEffect, useRef, useState } from "react"
import { Button, Grid, Paper, Table, TableBody, TableContainer, TableHead, TableRow } from "@mui/material"
import {Print as PrintIcon} from "@mui/icons-material"

import { APIError, formatTwoDateToTextPayroll, StyledTableCellPayroll } from "../../../../../customstring/CustomString"
import { getDeptPayData, getDeptPaySetupData } from "../../PayrollTransactionsRequests"
import { JOPrint } from "../../../setuppayroll/components/forms/jo/JOPrint"
import { APILoading } from "../../../../../apiresponse/APIResponse"
import Swal from "sweetalert2"
import { useReactToPrint } from "react-to-print"

export function JOPay({ loanType, signatories, user }) {
    const [paySetupData, setPaySetupData] = useState([])
    const [deptTitle, setDeptTitle] = useState('')
    const [selectedPayroll, setSelectedPayroll] = useState(null)
    const [data, setData] = useState([])

    useEffect(() => {
        initializeData()
    }, [])
    const initializeData = async () => {
        try {
            let t_data = { emp_status: 'JO' }
            const res = await getDeptPaySetupData(t_data);
            console.log(res)
            setPaySetupData(res.data.data)
            setDeptTitle(res.data.dept)
        }
        catch (error) {
            console.log(error)
        }
    }
    const handleViewPay = async (row) => {
        console.log(row)
        setSelectedPayroll(row)
        try {
            APILoading('info', 'Loading payroll data', 'Please wait...')
            let t_data = {
                payroll_no: row.payroll_no,
                payroll_group_id: row.payroll_group_id
            }
            const res = await getDeptPayData(t_data)
            console.log(res)
            setData(res.data.data)
            
            Swal.close()
            beforePrint()
        } catch (err) {
            APIError(err)
        }
    }
    const printPayrollRef = useRef()
    const reactToPrintPayroll = useReactToPrint({
        content: () => printPayrollRef.current,
        documentTitle: 'Payroll'
    })
    const beforePrint = () => {
        reactToPrintPayroll()
    }

    return (<>
        <Grid container>
            <Grid item xs={12}>
                <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCellPayroll> Payroll No </StyledTableCellPayroll>
                                <StyledTableCellPayroll> Group Name </StyledTableCellPayroll>
                                <StyledTableCellPayroll> Period Covered </StyledTableCellPayroll>
                                <StyledTableCellPayroll> Year </StyledTableCellPayroll>
                                <StyledTableCellPayroll>
                                
                                </StyledTableCellPayroll>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                paySetupData.length>0
                                ?
                                    paySetupData.map((item,key) => {
                                        return (
                                            <TableRow key={item.payroll_no}>
                                                <StyledTableCellPayroll> {item.payroll_no} </StyledTableCellPayroll>
                                                
                                                <StyledTableCellPayroll> {item.sub_name} </StyledTableCellPayroll>
                                                
                                                <StyledTableCellPayroll> {formatTwoDateToTextPayroll(item.period_from,item.period_to)} </StyledTableCellPayroll>
                                                
                                                <StyledTableCellPayroll> {item.year} </StyledTableCellPayroll>
                                                
                                                <StyledTableCellPayroll align='center'>
                                                    <Button size='small' variant='contained' className='custom-roundbutton' onClick={()=>handleViewPay(item)} startIcon={<PrintIcon/>}>Print Payroll</Button>
                                                </StyledTableCellPayroll>
                                            </TableRow>
                                        )
                                    })
                                :
                                    <StyledTableCellPayroll colSpan={5} align="center">
                                        No Data
                                    </StyledTableCellPayroll>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                </Paper>
            </Grid>
        </Grid>
        <div style={{display:'block'}}>
            <JOPrint ref={printPayrollRef} empList = {data} loans = {[]} signatories={signatories} selectedOffice = {selectedPayroll} periodFrom = {selectedPayroll?.period_from} periodTo = {selectedPayroll?.period_to} wTax={[]} user={user} />
        </div>
    </>
    )
}