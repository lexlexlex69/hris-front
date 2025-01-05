import { Autocomplete, Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { getDeptSpecialPayroll } from '../../SetupPayrollRequests';
import { APIError, formatExtName, formatMiddlename, formatWithCommas } from '../../../../../customstring/CustomString';
import { APILoading } from '../../../../../apiresponse/APIResponse';
import Swal from 'sweetalert2';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { blue, green, grey } from "@mui/material/colors";
import { PEIPrint } from '../forms/special/pei/PEIPrint';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import { auditLogs } from '../../../../../auditlogs/Request';
import PrintIcon from '@mui/icons-material/Print';
import { YearEndPrint } from '../forms/special/yearend/YearEndPrint';
import { CNAPrint } from '../forms/special/cna/CNAPrint';
import { SRIPrint } from '../forms/special/sri/SRIPrint';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[800],
        color: theme.palette.common.white,
        fontSize: '.7rem',
        padding: 5
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: '.7rem',
        padding: 10,
        fontWeight: 'light'
    },
    [`&.${tableCellClasses.footer}`]: {
        fontSize: '.7rem',
        padding: 10
    }
}));
export const AddSpecial = ({ offices, empStatus }) => {
    const [type, setType] = useState(['PEI', 'CNA', 'SRI', 'YEAR-END'])
    const [signatories, setSignatorires] = useState(null);
    const [filterEmpStat, setFilterEmpStat] = useState(null)
    const [selectedEmpStatus, setSelectedEmpStatus] = useState(null)
    const [selectedOffice, setSelectedOffice] = useState(null)
    const [selectedType, setSelectedType] = useState(null)
    const [selectedYear, setSelectedYear] = useState(moment().format('YYYY'))
    const [data, setData] = useState([]);
    const [user, setuser] = useState('')
    const [isHR, setIsHR] = useState(false);
    const [deptHead, setDeptHead] = useState([]);

    // const [empStatus,setEmpStatus] = useState([
    //     {
    //         status:'REGULAR',
    //         emp_status:'RE'
    //     },
    //             {
    //         status:'CASUAL',
    //         emp_status:'CS'
    //     },
    //     {
    //         status:'ELECTIVE',
    //         emp_status:'EL'
    //     },
    //     {
    //         status:'CO-TERMINOUS',
    //         emp_status:'CT'
    //     }
    // ])
    useEffect(() => {
        var include_list = ['RE', 'CS', 'EL', 'CT']
        if (empStatus) {
            var new_arr = empStatus.filter((el) => {
                return include_list.includes(el.code)
            })

            setFilterEmpStat(new_arr)
        }
    }, [empStatus])
    useEffect(() => {
        console.log(filterEmpStat)
    }, [filterEmpStat])
    useEffect(() => {
        console.log(selectedEmpStatus)
    }, [selectedEmpStatus])

    const handleSelectOffice = (event, newValue) => {
        setSelectedOffice(newValue)
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            APILoading('info', 'Loading Data', 'Please wait...')
            let t_data = {
                dept_code: selectedOffice.dept_code,
                type: selectedType,
                emp_status: selectedEmpStatus.code
            }
            const res = await getDeptSpecialPayroll(t_data);
            setData(res.data.data)
            setSignatorires(res.data.signatories)
            setuser(res.data.user)
            setIsHR(res.data.is_hr)
            setDeptHead(res.data.dept_head)
            console.log(res.data.dept_head)
            Swal.close();
        } catch (err) {
            APIError(err)
        }

    }
    const printPayroll = useRef()
    // const peiPrintPayroll = useRef()
    // const yearendPrintPayroll = useRef()
    // const yearendPrintPayroll = useRef()
    const printSpecialPayroll = useReactToPrint({
        content: () => printPayroll.current,
        documentTitle: selectedType + ' Payroll ' + selectedYear
    });
    // const printYearEndPayroll  = useReactToPrint({
    //     content: () => yearendPrintPayroll.current,
    //     documentTitle:'Year End Payroll '+selectedYear
    // });
    const beforePrint = () => {
        printSpecialPayroll();
        // switch(selectedType){
        //     case 'PEI':
        //         printPEIPayroll()
        //     break;
        //     case 'YEAR-END':
        //         printYearEndPayroll()
        //     break;
        // }
        var logs = {
            action: 'PRINT PAYROLL',
            action_dtl: selectedType + '- ' + selectedYear,
            module: 'PAYROLL'
        }
        auditLogs(logs)
        // console.log(moment(new Date()).format('MM/DD/YYYY h:mm: a'))
    }
    const amountAccrued = (amount, cashgift) => {
        let total = parseFloat(amount) + parseFloat(cashgift);

        return total > 0 ? formatWithCommas(total.toFixed(2)) : '-'
    }
    const amountDue = (amount, cashgift, bcgea) => {
        console.log(bcgea)
        let total = (parseFloat(amount) + parseFloat(cashgift)) - parseFloat(bcgea);
        return total > 0 ? formatWithCommas(total.toFixed(2)) : '-'
    }
    const printDiv = () => {
        switch (selectedType) {
            case 'PEI':
                return (
                    <div style={{ display: 'none' }}>
                        <PEIPrint ref={printPayroll} empList={data} signatories={signatories} selectedOffice={selectedOffice} year={selectedYear} empStatus={selectedEmpStatus?.code ?? selectedEmpStatus?.status} user={user} isHR={isHR} deptHead={deptHead} />
                    </div>);
                break;
            case 'CNA':
                return (
                    <div style={{ display: 'none' }}>
                        <CNAPrint ref={printPayroll} empList={data} signatories={signatories} selectedOffice={selectedOffice} year={selectedYear} empStatus={selectedEmpStatus?.code ?? selectedEmpStatus?.status} user={user} isHR={isHR} deptHead={deptHead} />
                    </div>);
                break;
            case 'SRI':
                return (
                    <div style={{ display: 'none' }}>
                        <SRIPrint ref={printPayroll} empList={data} signatories={signatories} selectedOffice={selectedOffice} year={selectedYear} empStatus={selectedEmpStatus?.code ?? selectedEmpStatus?.status} user={user} isHR={isHR} deptHead={deptHead} />
                    </div>);
                break;
            case 'YEAR-END':
                return (
                    <div style={{ display: 'none' }}>
                        <YearEndPrint ref={printPayroll} empList={data} signatories={signatories} selectedOffice={selectedOffice} year={selectedYear} empStatus={selectedEmpStatus?.code ?? selectedEmpStatus?.status} user={user} isHR={isHR} deptHead={deptHead} />
                    </div>
                )
                break;
        }
    }
    return (
        <Box sx={{ maxHeight: '90vh', overflow: 'auto' }}>
            {/* <Box> */}
            <Grid container spacing={1} sx={{ pt: 1 }}>

                <Grid item xs={12} sx={{ display: 'flex', gap: 1 }}>
                    <form style={{ width: '100%', display: 'flex', flexDirection: 'row', gap: 1 }} onSubmit={handleSubmit}>

                        <Autocomplete
                            disablePortal
                            id="combo-box-pay-type"
                            options={type}
                            getOptionLabel={(option) => option}
                            // isOptionEqualToValue={(option, value) => option.dept_code === value.dept_code }
                            sx={{ width: 300 }}
                            // fullWidth
                            size="small"
                            value={selectedType}
                            onChange={(e, val) => {
                                setSelectedType(val)
                                setData([])
                            }}
                            renderInput={(params) => <TextField {...params} label="Payroll Type" required />}
                        />
                        <Autocomplete
                            disablePortal
                            id="combo-box-emp-status"
                            options={offices}
                            getOptionLabel={(option) => option.dept_title}
                            isOptionEqualToValue={(option, value) => option.dept_code === value.dept_code}
                            // sx={{ width: 300 }}
                            fullWidth
                            size="small"
                            value={selectedOffice}
                            onChange={handleSelectOffice}
                            renderInput={(params) => <TextField {...params} label="Filter Office" required />}
                        />
                        <Autocomplete
                            disablePortal
                            id="combo-box-dept"
                            options={filterEmpStat}
                            getOptionLabel={(option) => option.code}
                            isOptionEqualToValue={(option, value) => option.code === value.code}
                            sx={{ width: 250 }}
                            // fullWidth
                            size="small"
                            value={selectedEmpStatus}
                            onChange={(e, val) => {
                                setSelectedEmpStatus(val)
                            }}
                            renderInput={(params) => <TextField {...params} label="Emp Status" required />}
                        />
                        <TextField label='Year' value={selectedYear} onChange={(val) => setSelectedYear(val.target.value)} size="small" required />
                        <Button endIcon={<SendIcon />} sx={{ width: 180 }} variant='contained' type='submit'>Proceed </Button>
                        {
                            data.length > 0
                                ?
                                <Button endIcon={<PrintIcon />} sx={{ width: 150 }} variant='outlined' type='submit' onClick={beforePrint}>PRINT</Button>
                                :
                                null
                        }
                    </form>

                </Grid>
                <Grid item xs={12}>
                    {
                        data.length > 0
                            ?
                            selectedType === 'PEI'
                                ?
                                <Paper>
                                    <TableContainer sx={{ maxHeight: '70vh' }}>
                                        <Table stickyHeader>
                                            <TableHead sx={{ position: 'sticky', top: 0 }}>
                                                <TableRow>
                                                    <StyledTableCell rowSpan={2} align='center'>
                                                        No.
                                                    </StyledTableCell>
                                                    <StyledTableCell rowSpan={2} align='center' >
                                                        Name
                                                    </StyledTableCell>
                                                    <StyledTableCell rowSpan={2} align='center'>
                                                        Position
                                                    </StyledTableCell>
                                                    <StyledTableCell rowSpan={2} align='right'>
                                                        Monthly <br />
                                                        Rate
                                                    </StyledTableCell>
                                                    <StyledTableCell rowSpan={2} align='center'>
                                                        Start Date
                                                    </StyledTableCell>
                                                    <StyledTableCell rowSpan={2} align='center'>
                                                        {selectedType}
                                                    </StyledTableCell>
                                                    <StyledTableCell colSpan={3} align='center'>
                                                        Deduction
                                                    </StyledTableCell>
                                                    <StyledTableCell rowSpan={2} align='center'>
                                                        Amount <br />
                                                        Due
                                                    </StyledTableCell>
                                                    <StyledTableCell rowSpan={2} align='center'>
                                                        Signature of <br /> Payee
                                                    </StyledTableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <StyledTableCell></StyledTableCell>
                                                    <StyledTableCell></StyledTableCell>
                                                    <StyledTableCell></StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    data.map((item, key) => {
                                                        return (
                                                            <TableRow key={item.id}>
                                                                <StyledTableCell align='center' sx={{ color: item.date_resigned ? 'red' : 'auto' }}>
                                                                    {key + 1}
                                                                </StyledTableCell>
                                                                <StyledTableCell sx={{ color: item.date_resigned ? 'red' : 'auto' }}>
                                                                    {`${item.lname} ${formatExtName(item.extname)}, ${item.fname} ${formatMiddlename(item.mname)}`}
                                                                </StyledTableCell>
                                                                <StyledTableCell sx={{ color: item.date_resigned ? 'red' : 'auto' }}>
                                                                    {item.description}
                                                                </StyledTableCell>
                                                                <StyledTableCell align='right' sx={{ color: item.date_resigned ? 'red' : 'auto' }}>
                                                                    {formatWithCommas(parseFloat(item.m_salary))}
                                                                </StyledTableCell>
                                                                <StyledTableCell sx={{ color: item.date_resigned ? 'red' : 'auto' }}>
                                                                    {item.date_hired}
                                                                </StyledTableCell>
                                                                <StyledTableCell align='right' sx={{ color: item.date_resigned ? 'red' : 'auto' }}>
                                                                    {item.amount > 0 ? formatWithCommas(parseFloat(item.amount).toFixed(2)) : '-'}
                                                                </StyledTableCell >
                                                                <StyledTableCell sx={{ color: item.date_resigned ? 'red' : 'auto' }}>
                                                                    -
                                                                </StyledTableCell>
                                                                <StyledTableCell sx={{ color: item.date_resigned ? 'red' : 'auto' }}>
                                                                    -
                                                                </StyledTableCell>
                                                                <StyledTableCell sx={{ color: item.date_resigned ? 'red' : 'auto' }}>
                                                                    -
                                                                </StyledTableCell>
                                                                <StyledTableCell align='right' sx={{ color: item.date_resigned ? 'red' : 'auto' }}>
                                                                    {item.amount > 0 ? formatWithCommas(parseFloat(item.amount).toFixed(2)) : '-'}
                                                                </StyledTableCell>
                                                                <StyledTableCell sx={{ color: item.date_resigned ? 'red' : 'auto' }}>
                                                                    {item.date_resigned ? `Resigned ${moment(item.date_resigned).format('MM/DD/YYYY')}` : ''}
                                                                </StyledTableCell>
                                                            </TableRow>

                                                        )
                                                    })
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>

                                :
                                selectedType === 'SRI'
                                    ?
                                    <Paper>
                                        <TableContainer sx={{ maxHeight: '70vh' }}>
                                            <Table stickyHeader>
                                                <TableHead sx={{ position: 'sticky', top: 0 }}>
                                                    <TableRow>
                                                        <StyledTableCell rowSpan={2} align='center'>
                                                            No.
                                                        </StyledTableCell>
                                                        <StyledTableCell rowSpan={2} align='center' >
                                                            Name
                                                        </StyledTableCell>
                                                        <StyledTableCell rowSpan={2} align='center'>
                                                            Position
                                                        </StyledTableCell>
                                                        <StyledTableCell rowSpan={2} align='right'>
                                                            Monthly <br />
                                                            Rate
                                                        </StyledTableCell>
                                                        <StyledTableCell rowSpan={2} align='center'>
                                                            Start Date
                                                        </StyledTableCell>
                                                        <StyledTableCell rowSpan={2} align='center'>
                                                            {selectedType}
                                                        </StyledTableCell>
                                                        <StyledTableCell colSpan={3} align='center'>
                                                            Deduction
                                                        </StyledTableCell>
                                                        <StyledTableCell rowSpan={2} align='center'>
                                                            Amount <br />
                                                            Due
                                                        </StyledTableCell>
                                                        <StyledTableCell align='center'>
                                                            Signature of <br /> Payee
                                                        </StyledTableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <StyledTableCell></StyledTableCell>
                                                        <StyledTableCell></StyledTableCell>
                                                        <StyledTableCell></StyledTableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {
                                                        data.map((item, key) => {
                                                            return (
                                                                <TableRow key={item.id}>
                                                                    <StyledTableCell align='center'>
                                                                        {key + 1}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell>
                                                                        {`${item.lname} ${formatExtName(item.extname)}, ${item.fname} ${formatMiddlename(item.mname)}`}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell>
                                                                        {item.description}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell align='right'>
                                                                        {formatWithCommas(parseFloat(item.m_salary))}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell>
                                                                        {item.date_hired}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell align='right'>
                                                                        {formatWithCommas(parseFloat(item.amount).toFixed(2))}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell>
                                                                        -
                                                                    </StyledTableCell>
                                                                    <StyledTableCell>
                                                                        -
                                                                    </StyledTableCell>
                                                                    <StyledTableCell>
                                                                        -
                                                                    </StyledTableCell>
                                                                    <StyledTableCell align='right'>
                                                                        {formatWithCommas(parseFloat(item.amount).toFixed(2))}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell sx={{ color: item.date_resigned ? 'red' : 'auto' }}>
                                                                        {item.date_resigned ? `Resigned ${moment(item.date_resigned).format('MM/DD/YYYY')}` : ''}
                                                                    </StyledTableCell>
                                                                </TableRow>

                                                            )
                                                        })
                                                    }
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Paper>
                                    :
                                    selectedType === 'CNA'
                                        ?
                                        <Paper>
                                            <TableContainer sx={{ maxHeight: '70vh' }}>
                                                <Table stickyHeader>
                                                    <TableHead sx={{ position: 'sticky', top: 0 }}>
                                                        <TableRow>
                                                            <StyledTableCell rowSpan={2} align='center'>
                                                                No.
                                                            </StyledTableCell>
                                                            <StyledTableCell rowSpan={2} align='center' >
                                                                Name
                                                            </StyledTableCell>
                                                            <StyledTableCell rowSpan={2} align='center'>
                                                                Position
                                                            </StyledTableCell>
                                                            <StyledTableCell rowSpan={2} align='right'>
                                                                Monthly <br />
                                                                Rate
                                                            </StyledTableCell>
                                                            <StyledTableCell rowSpan={2} align='center'>
                                                                Start Date
                                                            </StyledTableCell>
                                                            <StyledTableCell rowSpan={2} align='center'>
                                                                {selectedType}
                                                            </StyledTableCell>
                                                            <StyledTableCell colSpan={3} align='center'>
                                                                Deduction
                                                            </StyledTableCell>
                                                            <StyledTableCell rowSpan={2} align='center'>
                                                                Amount <br />
                                                                Due
                                                            </StyledTableCell>
                                                            <StyledTableCell align='center'>
                                                                Signature of <br /> Payee
                                                            </StyledTableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <StyledTableCell>BCGEA</StyledTableCell>
                                                            <StyledTableCell></StyledTableCell>
                                                            <StyledTableCell></StyledTableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {
                                                            data.map((item, key) => {
                                                                return (
                                                                    <TableRow key={item.id}>
                                                                        <StyledTableCell align='center'>
                                                                            {key + 1}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell>
                                                                            {`${item.lname} ${formatExtName(item.extname)}, ${item.fname} ${formatMiddlename(item.mname)}`}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell>
                                                                            {item.description}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell align='right'>
                                                                            {formatWithCommas(parseFloat(item.m_salary))}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell>
                                                                            {item.date_hired}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell align='right'>
                                                                            {item.amount > 0 ? formatWithCommas(parseFloat(item.amount).toFixed(2)) : '-'}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell>
                                                                            {item.bcgea > 0 ? formatWithCommas(parseFloat(item.bcgea).toFixed(2)) : '-'}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell>
                                                                            -
                                                                        </StyledTableCell>
                                                                        <StyledTableCell>
                                                                            -
                                                                        </StyledTableCell>
                                                                        <StyledTableCell align='right'>
                                                                            {item.amount > 0 ? formatWithCommas(parseFloat(item.amount - item.bcgea).toFixed(2)) : '-'}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell sx={{ color: item.date_resigned ? 'red' : 'auto' }}>
                                                                            {item.date_resigned ? `Separated ${moment(item.date_resigned).format('MM/DD/YYYY')}` : ''}
                                                                        </StyledTableCell>
                                                                    </TableRow>

                                                                )
                                                            })
                                                        }
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Paper>
                                        :
                                        selectedType === 'YEAR-END'
                                            ?
                                            <Paper>
                                                <TableContainer sx={{ maxHeight: '70vh' }}>
                                                    <Table stickyHeader>
                                                        <TableHead>
                                                            <TableRow>
                                                                <StyledTableCell rowSpan={2} align='center'>
                                                                    No.
                                                                </StyledTableCell>
                                                                <StyledTableCell rowSpan={2} align='center' >
                                                                    Name
                                                                </StyledTableCell>
                                                                <StyledTableCell rowSpan={2} align='center'>
                                                                    Position
                                                                </StyledTableCell>
                                                                <StyledTableCell rowSpan={2} align='right'>
                                                                    Monthly <br />
                                                                    Rate
                                                                </StyledTableCell>
                                                                <StyledTableCell rowSpan={2} align='center'>
                                                                    Start Date
                                                                </StyledTableCell>
                                                                <StyledTableCell rowSpan={2} align='center'>
                                                                    Year End <br />
                                                                    Bonus
                                                                </StyledTableCell>
                                                                <StyledTableCell rowSpan={2} align='center'>
                                                                    Cash <br />
                                                                    Gift
                                                                </StyledTableCell>
                                                                <StyledTableCell rowSpan={2} align='center'>
                                                                    Amount <br />
                                                                    Accrued
                                                                </StyledTableCell>
                                                                <StyledTableCell colSpan={3} align='center'>
                                                                    Deduction
                                                                </StyledTableCell>
                                                                <StyledTableCell rowSpan={2} align='center'>
                                                                    Amount <br />
                                                                    Due
                                                                </StyledTableCell>
                                                                <StyledTableCell align='center'>
                                                                    Signature of <br /> Payee
                                                                </StyledTableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <StyledTableCell></StyledTableCell>
                                                                <StyledTableCell></StyledTableCell>
                                                                <StyledTableCell></StyledTableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {
                                                                data.map((item, key) => {
                                                                    return (
                                                                        <TableRow key={item.id} >
                                                                            <StyledTableCell align='center' sx={{ color: item.date_resigned ? 'red' : 'auto' }}>
                                                                                {key + 1}
                                                                            </StyledTableCell>
                                                                            <StyledTableCell sx={{ color: item.date_resigned ? 'red' : 'auto', textTransform: 'uppercase' }}>
                                                                                {`${item.lname} ${formatExtName(item.extname)}, ${item.fname} ${formatMiddlename(item.mname)}`}
                                                                            </StyledTableCell>
                                                                            <StyledTableCell sx={{ color: item.date_resigned ? 'red' : 'auto' }}>
                                                                                {item.description}
                                                                            </StyledTableCell>
                                                                            <StyledTableCell align='right' sx={{ color: item.date_resigned ? 'red' : 'auto' }}>
                                                                                {formatWithCommas(parseFloat(item.m_salary).toFixed(2))}
                                                                            </StyledTableCell>
                                                                            <StyledTableCell sx={{ color: item.date_resigned ? 'red' : 'auto' }}>
                                                                                {item.date_hired}
                                                                            </StyledTableCell>
                                                                            <StyledTableCell align='right' sx={{ color: item.date_resigned ? 'red' : 'auto' }}>
                                                                                {
                                                                                    item.amount > 0 ? formatWithCommas(parseFloat(item.amount).toFixed(2)) : ''
                                                                                }
                                                                            </StyledTableCell>

                                                                            <StyledTableCell align='right' sx={{ color: item.date_resigned ? 'red' : 'auto' }}>
                                                                                {item.cashgift > 0 ? formatWithCommas(parseFloat(item.cashgift).toFixed(2)) : ''}
                                                                            </StyledTableCell>
                                                                            <StyledTableCell align='right' sx={{ color: item.date_resigned ? 'red' : 'auto' }}>
                                                                                {
                                                                                    amountAccrued(item.amount, item.cashgift)
                                                                                }
                                                                            </StyledTableCell>

                                                                            <StyledTableCell sx={{ color: item.date_resigned ? 'red' : 'auto' }}>
                                                                                {item.deduction > 0 ? item.deduction : '-'}
                                                                            </StyledTableCell>
                                                                            <StyledTableCell sx={{ color: item.date_resigned ? 'red' : 'auto' }}>
                                                                                -
                                                                            </StyledTableCell>
                                                                            <StyledTableCell sx={{ color: item.date_resigned ? 'red' : 'auto' }}>
                                                                                -
                                                                            </StyledTableCell>
                                                                            <StyledTableCell align='right' sx={{ color: item.date_resigned ? 'red' : 'auto' }}>
                                                                                {
                                                                                    amountDue(item.amount, item.cashgift, item.deduction)
                                                                                }
                                                                            </StyledTableCell>
                                                                            <StyledTableCell sx={{ color: item.date_resigned ? 'red' : 'auto' }}>
                                                                                {item.date_resigned ? `Resigned ${moment(item.date_resigned).format('MM/DD/YYYY')}` : ''}
                                                                            </StyledTableCell>
                                                                        </TableRow>

                                                                    )
                                                                })
                                                            }
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>

                                            </Paper>
                                            :
                                            null

                            :
                            null
                    }

                </Grid>
            </Grid>
            {
                printDiv()
            }
        </Box>
    );
}