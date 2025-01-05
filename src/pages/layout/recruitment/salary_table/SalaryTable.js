import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import {orange} from '@mui/material/colors';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import moment from 'moment';
// date-fns
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { fetchSalaryTable, filterYear } from './Controller';
import TextField from '@mui/material/TextField'
import { Button, Skeleton, Tooltip, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CommonModal from '../../../../common/Modal'

import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import AddUpdate from './AddUpdate';

const f = new Intl.NumberFormat("en-us", { style: 'currency', currency: 'PHP' })


const SalaryTable = () => {
    let abortController = new AbortController()
    const theme = createTheme({
        typography: {
            body2: {
                fontFamily: ['Roboto','Sans-serif'].join(','),
                fontSize: '11px',
            }
        }
    })
    const [openAddUpdate, setOpenAddUpdate] = useState(false)
    const [modalTitle, setModalTitle] = useState('')
    const [modalState, setModalState] = useState('')
    const [salaryTable, setSalaryTable] = useState([])
    const [filters, setFilters] = useState({
    })
    const [searchYear, setSearchYear] = useState()
    const [loader, setLoader] = useState(true)

    const handleOpenModal = (row, category) => {
        console.log(row)
        setModalState(row)
        setOpenAddUpdate(true)
        setModalTitle(category)
    }

    useEffect(() => {
        fetchSalaryTable(abortController, setSalaryTable, searchYear, setLoader)
        return (() => abortController.abort())
    }, [])
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} md={12} lg={12}>
                <CommonModal open={openAddUpdate} setOpen={setOpenAddUpdate} title={modalTitle.toLocaleUpperCase()}>
                    <AddUpdate data={modalState || ''} category={modalTitle} setSalaryTable={setSalaryTable} salaryTable={salaryTable} setOpenAddUpdate={setOpenAddUpdate} />
                </CommonModal>
                <Container maxWidth="lg">
                    <Box id="filterings" display='flex' justifyContent='space-between' mb={1} width="100%">
                        <Button startIcon={<AddIcon />} sx={{ borderRadius: '2rem' }} variant="contained" onClick={() => handleOpenModal('', 'Add')}>Add row</Button>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                views={['year']}
                                label="FROM"
                                value={searchYear}
                                onChange={(newDate) => filterYear(newDate, setSearchYear, abortController, setSalaryTable, setLoader)}
                                renderInput={(params) => <TextField size='small' required {...params} helperText={null} />}
                            />
                        </LocalizationProvider>
                    </Box>
                    <Box id="salary_table">
                        <ThemeProvider theme={theme} >
                            <TableContainer component={Paper} sx={{ maxHeight: '80vh' }}>
                                <Table sx={{ minWidth: '100% ' }} aria-label="salary grade table" size='small' stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>PARTICULARS</TableCell>
                                            <TableCell align="left">EFFECTIVITY</TableCell>
                                            <TableCell align="left">SALARY GRADE</TableCell>
                                            <TableCell align="right">STEP1</TableCell>
                                            <TableCell align="right">STEP2</TableCell>
                                            <TableCell align="right">STEP3</TableCell>
                                            <TableCell align="right">STEP4</TableCell>
                                            <TableCell align="right">STEP5</TableCell>
                                            <TableCell align="right">STEP6</TableCell>
                                            <TableCell align="right">STEP7</TableCell>
                                            <TableCell align="right">STEP8</TableCell>
                                            <TableCell align="right">ACTIONS</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {loader && (
                                            <>
                                                {Array.from(Array(10)).map((item, index) => (
                                                    <TableRow>
                                                        {Array.from(Array(12)).map((item, index) => (
                                                            <TableCell>
                                                                <Skeleton></Skeleton>
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))}
                                            </>
                                        )}
                                        {!loader && salaryTable.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={12} sx={{bgcolor:'error.main',color:'#fff'}} align="center">
                                                        Data Empty!
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {salaryTable && salaryTable.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    {item?.Particulars}
                                                </TableCell>
                                                <TableCell>
                                                    {moment(item?.effectivity).format('MM-DD-YYYY')}
                                                </TableCell>
                                                <TableCell align="left">
                                                    {item?.sg}
                                                </TableCell>
                                                <TableCell align="right">
                                                {f.format(item?.step1)}
                                                </TableCell>
                                                <TableCell align="right">
                                                {f.format(item?.step2)}
                                                </TableCell>
                                                <TableCell align="right">
                                                {f.format(item?.step3)}
                                                </TableCell>
                                                <TableCell align="right">
                                                {f.format(item?.step4)}
                                                </TableCell>
                                                <TableCell align="right">
                                                {f.format(item?.step5)}
                                                </TableCell>
                                                <TableCell align="right">
                                                {f.format(item?.step6)}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {f.format(item?.step7)}
                                                </TableCell>
                                                <TableCell align="right">
                                                {f.format(item?.step8)}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Tooltip title="Update row">
                                                        <IconButton size='small' sx={{ color: orange[500], '&:hover': { color: orange[800] },border:`2px solid ${orange[500]}` }} onClick={() => handleOpenModal(item, 'update')}>
                                                            <EditIcon color="warning" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </ThemeProvider>
                    </Box>
                </Container>
            </Grid>
        </Grid>
    );
};

export default SalaryTable;