import React, { useContext, useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Modal from '@mui/material/Modal';
import Dialog from '@mui/material/Dialog';
import { blue, orange, red } from '@mui/material/colors';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Pagination from '@mui/material/Pagination';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';

import { getHistoryOfPositionsPerApplicant } from './Controller';
import Skeleton from '@mui/material/Skeleton'
import { Fade, Tooltip } from '@mui/material';

import DetailsModal from './tablePositionComponents/DetailsModal';
import CheckQs from './tableHistoryComponents/CheckQs';

import { TablePositionHistoryContext } from './TablePositionHistoryContext';
import { Search } from '@mui/icons-material';

import CommonModal from '../../../../common/Modal';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const TablePositions = () => {

    // table context
    const { tablePositionHistoryContext, setTableContext } = useContext(TablePositionHistoryContext)
    // details modal
    const [open, setOpen] = useState(false);
    const [modalState, setModalState] = useState('')
    const handleOpen = (item) => {
        setModalState(item)
        setOpen(true)
    };
    const handleClose = () => setOpen(false);
    // 
    // dialog
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogState, setDialogState] = useState(false);
    const handleClickOpenDialog = (item) => {
        setOpenDialog(true);
        setDialogState(item)
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    // 
    const [pos, setPos] = useState([])
    const [loader, setLoader] = useState(true)
    const perPage = 2
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [filters, setFilters] = useState({
        posStatus: '',
        posName: '',
    })

    const handlePaginate = (e, v) => {
        if (page === v)
            return
        else {
            getHistoryOfPositionsPerApplicant(setPos, setLoader, filters, v, perPage, setTotal)
            setPage(v)
        }
    }
    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSearchPosition = () => {
        getHistoryOfPositionsPerApplicant(setPos, setLoader, filters, page, perPage, setTotal)
    }

    useEffect(() => {
        // getHistoryOfPositionsPerApplicant(setPos, setLoader, filters, page, perPage, setTotal)
    }, [tablePositionHistoryContext])


    return (
        <div>
            {/* modal details */}
            <CommonModal open={open} handleClose={handleClose} setOpen={setOpen} customWidth='60%'>
                <DetailsModal data={modalState} />
            </CommonModal>
            {/* apply dialog */}
            <Dialog
                fullScreen
                open={openDialog}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <Typography variant="body1" color="initial" sx={{ color: '#fff', width: '100%' }}>Position Title: {dialogState.position_title}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                            <Button autoFocus color="inherit" onClick={handleCloseDialog} startIcon={<CloseIcon />}>
                                close
                            </Button>
                        </Box>
                    </Toolbar>
                </AppBar>
                <List>
                    <CheckQs data={dialogState} handleClose={handleCloseDialog} />
                </List>
            </Dialog>
            <Typography variant="body1" sx={{ bgcolor: '#BEBEBE', p: 1, color: '#fff' }}>JOB APPLICATION HISTORY</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Box display="" mx="" my="" sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, width: '50%', alignItems: 'center' }}>
                    <TextField
                        label="search position"
                        id="outlined-start-adornment"
                        size='small'
                        select
                        sx={{ flex: 1 }}
                        name="posStatus"
                        value={filters.posStatus}
                        onChange={handleFilterChange}
                    >
                        <MenuItem value='RE'>Permanent</MenuItem>
                        <MenuItem value='CS' >Casual</MenuItem>
                        <MenuItem value="JO" >Jo</MenuItem>
                        <MenuItem value='COS' >Cos</MenuItem>
                    </TextField>
                    <TextField
                        label="search position"
                        id="outlined-start-adornment"
                        sx={{ m: 1, width: '25ch', flex: 1 }}
                        name="posName"
                        value={filters.posName}
                        onChange={handleFilterChange}
                        size='small'
                    />
                    <Box>
                        <Tooltip title="Search">
                            <Search color='primary' sx={{ fontSize: 35, cursor: 'pointer', mr: 2 }} onClick={handleSearchPosition} />
                        </Tooltip>
                    </Box>

                </Box>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ mt: 1 }} aria-label="position table" size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: '#fff', bgcolor: '#787878' }} align="left">POSITION TITLE</TableCell>
                            <TableCell sx={{ color: '#fff', bgcolor: '#787878' }} align="left">PLANTILLA ITEM NO. / MPR number</TableCell>
                            <TableCell sx={{ color: '#fff', bgcolor: '#787878' }} align="left">PLACE OF ASSIGNMENT</TableCell>
                            <TableCell sx={{ color: '#fff', bgcolor: '#787878' }} align="left">STATUS OF APPOINTMENT</TableCell>
                            <TableCell sx={{ color: '#fff', bgcolor: '#787878' }} align="left">POSTING DATE</TableCell>
                            <TableCell sx={{ color: '#fff', bgcolor: '#787878' }} align="left">CLOSING DATE</TableCell>
                            <TableCell sx={{ color: '#fff', bgcolor: '#787878' }} align="left">STATUS</TableCell>
                            <TableCell sx={{ color: '#fff', bgcolor: '#787878' }} align="left">ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loader ? (
                            <>
                                {Array.from(Array(5)).map((item, i) => (
                                    <TableRow key={i} >
                                        {Array.from(Array(8)).map((x, i2) => (
                                            <TableCell key={i2} sx={{ color: '#fff' }} align="left"><Skeleton variant="text" width="" height={30} animation="pulse" /></TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </>
                        ) : (
                            <>
                                {pos && pos.map((item, i) => (
                                    <Fade in key={i}>
                                        <TableRow >
                                            <TableCell align="left">{item.position_name}</TableCell>
                                            <TableCell align="left">{item?.plantilla_id ? item?.plantilla_item : item?.mpr_no}</TableCell>
                                            <TableCell align="left">{item.dept_title}</TableCell>
                                            <TableCell align="left">{item?.emp_status === 'RE' ? 'PERMANENT' : item?.emp_status === 'CS' ? 'CASUAL' : item?.emp_status === 'JO' ? 'JOB ORDER' : item?.emp_status === 'COS' ? 'CONTRACT OF SERVICE' : ''}</TableCell>
                                            <TableCell align="left">{item.posting_date}</TableCell>
                                            <TableCell align="left">{item.closing_date}</TableCell>
                                            <TableCell align="left">{item.vacancy_status}</TableCell>
                                            <TableCell align="left" >
                                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                                    <Tooltip title="View details">
                                                        <InfoIcon sx={{ color: '#fff', bgcolor: `${blue[500]}`, '&:hover': { bgcolor: 'primary.dark' }, fontSize: 40, p: .5, px: 1, border: `2px solid ${blue[500]}`, borderRadius: '10px', cursor: 'pointer', transition: 'all .3s' }} onClick={() => handleOpen(item)} />
                                                    </Tooltip>
                                                    {item.vacancy_status === 'PENDING' && (
                                                        <Tooltip title="Update">
                                                            <EditIcon sx={{ color: '#fff', bgcolor: 'warning.main', '&:hover': { bgcolor: 'warning.dark' }, fontSize: 40, p: .5, px: 1, border: `2px solid ${orange[500]}`, borderRadius: '10px', cursor: 'pointer', transition: 'all .3s' }} onClick={() => handleClickOpenDialog(item)} />
                                                        </Tooltip>
                                                    )}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    </Fade>
                                ))}
                            </>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex' }}>
                {!loader && pos && pos.length === 0 && <Typography variant="body1" sx={{ bgcolor: red[300], px: 1, my: .5, color: '#fff', borderRadius: '.2rem', width: '100%' }} align='center'>no record</Typography>}
            </Box>
            <Pagination size='small' count={Math.ceil(total / perPage)} page={page} sx={{ mt: 1 }} onChange={handlePaginate} />
        </div>
    );
};

export default TablePositions;