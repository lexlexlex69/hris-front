import { Autocomplete, Box, Button, Divider, Grid, Input, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getOffices } from '../../../../manageworkscheduledept/WorkScheduleRequest';
import { getEmpListBillIDs, updateEmpBillIDs } from '../BillingRequest';
import { formatName, StyledTableCellPayroll } from '../../../../customstring/CustomString';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const tableHead = [
    { id: 'emp_billing_ids', headerName: 'Employee ID', width: 'auto' },
    { id: 'cname', headerName: 'Name', width: '250' },
    { id: 'gsis', headerName: 'GSIS', width: 'auto' },
    { id: 'tin', headerName: 'TIN', width: 'auto' },
    { id: 'pagibig', headerName: 'PAGIBIG', width: 'auto' },
    { id: 'philhealth', headerName: 'PHILHEALTH', width: 'auto' },
    { id: 'sss', headerName: 'SSS', width: 'auto' },
    { id: 'action', headerName: 'ACTION', width: 'auto' },
]

export const UpdateBillingIDs = () => {
    const [offices, setOffices] = useState([])
    const [filterOffice, setFilterOffice] = useState(null)
    const [empList, setEmpList] = useState([])
    const [editingRows, setEditingRows] = useState({})
    const [updatedBillingIDs, setUpdatedBillingIDs] = useState({})
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(5)

    useEffect(() => {
        _init();
    }, [])

    const _init = async () => {
        const res = await getOffices();
        setOffices(res.data)
    }

    useEffect(async () => {
        if (filterOffice) {
            const res = await getEmpListBillIDs({ dept_code: filterOffice.dept_code })
            setEmpList(res.data.data)
        }
    }, [filterOffice])

    const handleEditRow = (row) => {
        setEditingRows({ ...editingRows, [row.emp_billing_ids]: true })
        setUpdatedBillingIDs({ ...updatedBillingIDs, [row.emp_billing_ids]: { ...row } })
    }

    const handleSaveIDs = async () => {
        try {
            const res = await updateEmpBillIDs({ updated_emp_billing_ids: Object.values(updatedBillingIDs), dept_code: filterOffice.dept_code })
            console.log(res)
            if (res.data.status === 500) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error: ' + res.data.message,
                    text: '\n' + res.data.data.join(', ')
                })
                return;
            }
            if (res.data.status === 200) {
                setEditingRows({})
                setUpdatedBillingIDs({})
                setEmpList(res.data.data)
            }
        } catch (error) {
            console.error('Error saving billing IDs:', error)
        }
    }

    const handleCancelEdit = (row) => {
        const { [row.emp_billing_ids]: _, ...restEditingRows } = editingRows
        setEditingRows(restEditingRows)
        const { [row.emp_billing_ids]: __, ...restUpdatedBillingIDs } = updatedBillingIDs
        setUpdatedBillingIDs(restUpdatedBillingIDs)
    }

    const handleChangePage = (event, value) => {
        setPage(value);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    const handleInputChange = (event, row) => {
        setUpdatedBillingIDs({
            ...updatedBillingIDs,
            [row.emp_billing_ids]: {
                ...updatedBillingIDs[row.emp_billing_ids],
                [event.target.name]: event.target.value
            }
        })
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Autocomplete
                    disablePortal
                    id="combo-box-offices"
                    options={offices}
                    getOptionLabel={(option) => option.dept_title}
                    value={filterOffice}
                    onChange={(event, newValue) => {
                        setFilterOffice(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} label="Department" />}
                />
            </Grid>
            <Grid item xs={12}>
                <Divider sx={{ marginTop: '1rem', marginBottom: '1rem' }} />
            </Grid>
            <Grid item xs={12}>
                <Paper sx={{ paddingBottom: '1rem' }}>
                    <TableContainer>
                        <Table size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    {tableHead.map((data, index) => <StyledTableCellPayroll key={index} sx={{ width: data.width }}>{data.headerName}</StyledTableCellPayroll>)}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {empList.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((data, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{data.emp_billing_ids}</TableCell>
                                        <TableCell>{formatName(data.fname, data.mname, data.lname, data.extname, 0)}</TableCell>
                                        <TableCell>
                                            {editingRows[data.emp_billing_ids] ?
                                                <Input name="gsis" value={updatedBillingIDs[data.emp_billing_ids]?.gsis} onChange={(event) => handleInputChange(event, data)} />
                                                :
                                                data.gsis
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {editingRows[data.emp_billing_ids] ?
                                                <Input name="tin" value={updatedBillingIDs[data.emp_billing_ids]?.tin} onChange={(event) => handleInputChange(event, data)} />
                                                :
                                                data.tin
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {editingRows[data.emp_billing_ids] ?
                                                <Input name="pagibig" value={updatedBillingIDs[data.emp_billing_ids]?.pagibig} onChange={(event) => handleInputChange(event, data)} />
                                                :
                                                data.pagibig
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {editingRows[data.emp_billing_ids] ?
                                                <Input name="philhealth" value={updatedBillingIDs[data.emp_billing_ids]?.philhealth} onChange={(event) => handleInputChange(event, data)} />
                                                :
                                                data.philhealth
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {editingRows[data.emp_billing_ids] ?
                                                <Input name="sss" value={updatedBillingIDs[data.emp_billing_ids]?.sss} onChange={(event) => handleInputChange(event, data)} />
                                                :
                                                data.sss
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '0.2rem', alignItems: 'center' }}>
                                                {editingRows[data.emp_billing_ids] ? <>
                                                    <Button variant="contained" size='small' sx={{}} color='success' onClick={handleSaveIDs}>Save</Button>
                                                    <Button variant="contained" size='small' sx={{}} color="error" onClick={() => handleCancelEdit(data)}>Cancel</Button>
                                                </> : <Button variant="contained" size='small' sx={{}} onClick={() => handleEditRow(data)}>Edit</Button>
                                                }
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {empList.slice((page - 1) * rowsPerPage, page * rowsPerPage).length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={tableHead.length} align='center'>
                                            No Data
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Pagination
                        count={Math.ceil(empList.length / rowsPerPage)}
                        page={page}
                        onChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        shape="rounded"
                        variant='outlined'
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{ marginTop: '1rem' }}
                    />
                </Paper>
            </Grid>
        </Grid>
    )
}