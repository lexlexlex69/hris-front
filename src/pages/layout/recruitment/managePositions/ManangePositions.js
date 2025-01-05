import React, { useState, useEffect, useRef } from 'react'
import { orange, blue } from '@mui/material/colors'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';
import Slide from '@mui/material/Slide';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Pagination from '@mui/material/Pagination';
import Tooltip from '@mui/material/Tooltip'
import { useTheme } from '@mui/material/styles'
import { useMediaQuery, IconButton, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import moment from 'moment'

// mui icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';

import { getAllPositions } from './Controller'
import CustomDialog from '../components/CustomDialog';
import AddPosition from './AddPosition';
import ManagePositionDialog from '../components/ManagePositionDialog';
import UpdatePosition from './UpdatePosition';



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} />;
});

const ManangePositions = () => {

    const manage = useRef(true)
    // media query
    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.down('sm'))

    const typographyTheme = createTheme({
        typography: {
            body2: {
                fontFamily: ['Roboto', 'Sans-serif'].join(','),
                fontSize: '11px',
            }
        }
    })
    // dialog
    const [openAddPosition, setOpenAddPosition] = useState(false);
    const handleClickOpenAddPosition = () => {
        setOpenAddPosition(true);
    };
    const handleCloseAddPosition = () => {
        setOpenAddPosition(false);
    };
    const [openManage, setOpenManage] = useState(false);
    const handleClickOpenManage = (row) => {
        setDialogData(row)
        setDialogDataTrigger(true)
    };
    const handleCloseManage = () => {
        setDialogDataTrigger(false)
    };

    const [openUpdate, setOpenUpdate] = useState(false)
    const handleOpenUpdate = (row) => {
        setDialogData(row)
        setOpenUpdate(true)
    };
    const handleCloseUpdate = () => {
        setOpenUpdate(false)
    };
    // pagination
    const [page, setPage] = useState(1);
    const handleChange = (event, value) => {
        let controller = new AbortController()
        if (page === value)
            return
        else {
            getAllPositions(controller, setPositions, setLoader, value, setTotal, filters)
            setPage(value);
        }
    };
    // states
    const [positions, setPositions] = useState([])
    const [loader, setLoader] = useState(true)
    const [total, setTotal] = useState(0)
    const [dialogData, setDialogData] = useState('')
    const [dialogDataTrigger, setDialogDataTrigger] = useState(false)
    // state filters
    const [filters, setFilters] = useState({
        position_name: '',
        date_from: '',
        date_to: ''
    })
    const [fireSearchButton, setFireButton] = useState(false)
    const [fireClearFilter, setFireClearFilter] = useState(false)

    const handleChangeFilters = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value })
    }

    const handleClearFilters = () => {
        setFilters({
            position_name: '',
            date_from: '',
            date_to: ''
        })
        setPage(1)
        setFireClearFilter(prev => !prev)
    }

    const handleFireSearch = () => {
        setPage(1)
        setFireButton(prev => !prev)
    }

    useEffect(() => {
        let controller = new AbortController()
        getAllPositions(controller, setPositions, setLoader, page, setTotal, filters)
        return () => controller.abort()
    }, [fireSearchButton, fireClearFilter])

    // useEffect when clicking the manage button to hydrate data to component before firing the dialog box
    useEffect(() => {
        if (manage.current) {
            manage.current = false
            return
        }
        else {
            if (dialogDataTrigger) {
                setOpenManage(true)
            }
            else {
                setOpenManage(false);
            }
        }
    }, [dialogDataTrigger])

    return (
        <Box sx={{ flexGrow: 1 }}>
            <CssBaseline />
            <Grid container spacing={1}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Container maxWidth='lg' >
                        {/* dialog */}
                        <CustomDialog open={openAddPosition} handleClose={handleCloseAddPosition} fullScreen={false} >
                            <AddPosition setPositions={setPositions} positions={positions} handleCloseAddPosition={handleCloseAddPosition} />
                        </CustomDialog>
                        <CustomDialog open={openManage} handleClose={handleCloseManage} fullScreen={true} >
                            <ManagePositionDialog data={dialogData || ''} positions={positions || ''} setPositions={setPositions || ''} />
                        </CustomDialog>
                        <CustomDialog open={openUpdate} handleClose={handleCloseUpdate} >
                            <UpdatePosition data={dialogData || ''} positions={positions || ''} setPositions={setPositions || ''} handleClose={handleCloseUpdate} />
                        </CustomDialog>
                        {/*  */}

                        <Box sx={{ display: 'flex', justifyContent: matches ? 'flex-start' : 'space-between', alignItems: matches ? 'flex-start' : 'flex-end', flexDirection: matches ? 'column' : 'row' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%', mb: matches ? 3 : null }}>
                                <Button variant="contained" color="primary" sx={{ borderRadius: '2rem' }} startIcon={<AddIcon />} onClick={handleClickOpenAddPosition}>
                                    position
                                </Button>
                            </Box>
                            <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center', flexDirection: matches ? 'column' : 'row', width: matches ? '100%' : 'auto', px: matches ? 1 : null }}>
                                <Tooltip title="remove filters">
                                    <FilterAltOffIcon sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' }, transition: 'all .3s', cursor: 'pointer' }} onClick={handleClearFilters} />
                                </Tooltip>
                                <TextField
                                    fullWidth
                                    id=""
                                    label="position name"
                                    size='small'
                                    name="position_name"
                                    onChange={handleChangeFilters}
                                />
                                <TextField
                                    fullWidth
                                    id=""
                                    focused
                                    label="from"
                                    size='small'
                                    type='date'
                                    name="date_from"
                                    onChange={handleChangeFilters}
                                />
                                <TextField
                                    fullWidth
                                    id=""
                                    focused
                                    label="to"
                                    size='small'
                                    type='date'
                                    name="date_to"
                                    onChange={handleChangeFilters}
                                />
                                <Box sx={{ width: matches ? '100%' : null }}>
                                    <Tooltip title="search">
                                        <SearchIcon color='primary' sx={{ cursor: 'pointer',ml:1 }} onClick={handleFireSearch} />
                                    </Tooltip>
                                </Box>
                            </Box>
                        </Box>
                        <ThemeProvider theme={typographyTheme}>
                            <TableContainer component={Paper} sx={{ mt: matches ? 3 : 1 }}>
                                <Table aria-label="positions table" size='small'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>POSITION TITLE</TableCell>
                                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">CODE</TableCell>
                                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">POSITION DESCRIPTION</TableCell>
                                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">REMARKS</TableCell>
                                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">DATE CREATED</TableCell>
                                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">DATE UPDATED</TableCell>
                                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">ACTIONS</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {loader ? (<>
                                            {Array.from(Array(10)).map((row, i) => (
                                                <TableRow
                                                    key={i}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        <Skeleton variant="text" width='100%' height={30} />
                                                    </TableCell>
                                                    <TableCell align="left"> <Skeleton variant="text" width='100%' height={30} /></TableCell>
                                                    <TableCell align="left"> <Skeleton variant="text" width='100%' height={30} /></TableCell>
                                                    <TableCell align="left"> <Skeleton variant="text" width='100%' height={30} /></TableCell>
                                                    <TableCell align="left"> <Skeleton variant="text" width='100%' height={30} /></TableCell>
                                                    <TableCell align="left"> <Skeleton variant="text" width='100%' height={30} /></TableCell>
                                                    <TableCell align="left">
                                                        <Skeleton variant="text" width='100%' height={30} />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </>) : (
                                            <>
                                                {positions && positions.map((row) => (
                                                    <TableRow
                                                        key={row.id}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: '#e8eaf6' } }}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            {row.position_name}
                                                        </TableCell>
                                                        <TableCell align="left">{row.code}</TableCell>
                                                        <TableCell align="left">{row.description}</TableCell>
                                                        <TableCell align="left">{row.remarks}</TableCell>
                                                        <TableCell align="left">{moment(row.created_at).format('YYYY-MM-DD')}</TableCell>
                                                        <TableCell align="left">{moment(row.updated_at).format('YYYY-MM-DD')}</TableCell>
                                                        <TableCell align="left" sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                                            <Tooltip title="Edit row">
                                                                <IconButton aria-label="" size='small' sx={{ color: orange[500], '&:hover': { color: orange[800] }, border: `2px solid ${orange[500]}` }} onClick={() => handleOpenUpdate(row)}>
                                                                    <EditIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Qualification Standard">
                                                                <IconButton aria-label="" size='small' sx={{ color: blue[500], '&:hover': { color: blue[800] }, border: `2px solid ${blue[500]}` }} onClick={() => handleClickOpenManage(row)}>
                                                                    <AutoAwesomeMotionIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </ThemeProvider>
                        <Box sx={{ mt: 1 }}>
                            <Pagination color='primary' count={Math.ceil(total / 10)} page={page} onChange={handleChange} />
                        </Box>
                    </Container>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ManangePositions;