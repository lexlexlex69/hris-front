import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { blue } from '@mui/material/colors'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Pagination from '@mui/material/Pagination';
import MenuItem from '@mui/material/MenuItem'

import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import MovingIcon from '@mui/icons-material/Moving';
// components
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// images
// mui icons
import { getPublicatedJobs, customSorting, handleRegister } from './Controller';
import DetailsModal from '../outsiderLayout/dashboard/mainDashboard/tablePositionComponents/DetailsModal';
import CommonModal from '../../common/Modal';
import QuickTour from './QuickTour';
import { Tooltip } from '@mui/material';

function Recruitment() {
    // details modal
    const detailsRef = useRef(true)
    const [open, setOpen] = useState(false);
    const handleOpen = (item) => {
        setModalData(item)
        setOpen(true)
    };
    const [trigger, setTrigger] = useState(false)
    const [modalData, setModalData] = useState('')
    const handleClose = () => setOpen(false)
    // const handleClose = () => {
    //     setTrigger(false)
    //     setOpen(false)
    // };
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    // navigate
    const [perPage, setPerPage] = useState(2)
    const navigate = useNavigate()
    // redux
    const [pos, setPos] = useState('')
    const [total, setTotal] = useState(0)
    const [pages, setPages] = useState(1)
    const [loader, setLoader] = useState(true)

    const [filters, setFilters] = useState({
        posStatus: 'RE',
        posName: ''
    })

    // open quick tour
    const [openTour, setOpenTour] = useState(false)
    const handleCloseTour = () => setOpenTour(false)

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handlePagination = (e, value) => {
        setPages(value)
        getPublicatedJobs(setPos, setLoader, filters, value, setPages, setTotal, perPage)
    }

    const handleSearchPosition = () => {
        getPublicatedJobs(setPos, setLoader, filters, pages, setPages, setTotal, perPage)
    }

    useEffect(() => {
        // getPublicatedJobs(setPos, setLoader, filters, pages, setPages, setTotal, perPage)
    }, [])

    const perPageRef = useRef(true)

    useEffect(() => {
        if (perPageRef.current) {
            perPageRef.current = false
        }
        else {
            getPublicatedJobs(setPos, setLoader, filters, 1, setPages, setTotal, perPage)
        }
    }, [perPage])



    // useEffect(() => {
    //     if (detailsRef.current) {
    //         detailsRef.current = false
    //     }
    //     else {
    //         if (trigger) {
    //             setOpen(true)
    //         }
    //     }
    // }, [trigger])

    return (
        <Box sx={{ height: { sx: 'calc(100vh - 66px)', md: 'auto' }, mb: 2 }}>
            <CommonModal open={open} handleClose={handleClose} setOpen={setOpen} customWidth='60%' >
                <DetailsModal data={modalData} />
            </CommonModal>
            <CommonModal open={openTour} handleClose={handleCloseTour} setOpen={setOpenTour} customWidth='60%' title='HRIS application quick tour' >
                <QuickTour />
            </CommonModal>
            <CssBaseline />
            <Box mt={{ xs: 1, md: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center', flexDirection: { xs: 'column', md: 'row' } }}>
                    <Button variant='contained' startIcon={<MovingIcon />} onClick={() => setOpenTour(true)}>click me for a quick tour on HRIS application</Button>
                    <Box sx={{ width: { xs: '100%', md: '50%' }, display: 'flex', justifyContent: 'flex-end', mb: 1, alignItems: 'center', gap: 1, mt: { xs: 2, md: 0 } }}>
                        <TextField
                            label="search position"
                            id="outlined-start-adornment"
                            size='small'
                            select
                            sx={{ width: { xs: '100%', md: '25ch' } }}
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
                            sx={{ width: { xs: '100%', md: '25ch' } }}
                            name="posName"
                            value={filters.posName}
                            onChange={handleFilterChange}
                            size='small'
                        />
                        <Tooltip title="Search">
                            <SearchIcon sx={{ color: 'primary.main', fontSize: 40, cursor: 'pointer' }} onClick={handleSearchPosition} />
                        </Tooltip>
                    </Box>
                </Box>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table" size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box>
                                            POSTION TITLE
                                        </Box>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', m: 0, p: 0 }}>
                                            <ArrowDropUpIcon onClick={() => customSorting('asc', pos, 'position_title', setPos)} sx={{ cursor: 'pointer', mb: -.5, '&:hover': { color: blue[800] }, transition: 'all .3s' }} />
                                            <ArrowDropDownIcon onClick={() => customSorting('desc', pos, 'position_title', setPos)} sx={{ cursor: 'pointer', mt: -.5, '&:hover': { color: blue[800] }, transition: 'all .3s' }} />
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="center">PLANTILLA ITEM NO. / MPR number</TableCell>
                                <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="center">EMPLOYMENT STATUS</TableCell>
                                <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="center">PLACE OF ASSIGNMENT</TableCell>
                                <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="center">PUBLICATION DATE</TableCell>
                                <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="center">PUBLICATION-END DATE</TableCell>
                                <TableCell className='cgb-color-table' sx={{ color: '#fff' }} colSpan={2} align="left">ACTION</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!loader ? (
                                <React.Fragment>
                                    {pos && pos.map((row, index) => (
                                        <Fade in key={index}>
                                            <TableRow

                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row?.position_name}
                                                </TableCell>
                                                <TableCell align="center">{row?.plantilla_id ? row?.plantilla_item : row?.mpr_no}</TableCell>
                                                <TableCell align="center">{row?.emp_status === 'RE' ? 'PERMANENT' : row?.emp_status === 'CS' ? 'CASUAL' : row?.emp_status === 'JO' ? 'JOB ORDER' : row?.emp_status === 'COS' ? 'CONTRACT OF SERVICE' : ''}</TableCell>
                                                <TableCell align="center">{row.dept_title}</TableCell>
                                                <TableCell align="center">{row.posting_date}</TableCell>
                                                <TableCell align="center">{row.closing_date}</TableCell>
                                                <TableCell align="right">
                                                    <Tooltip title="View details">
                                                        <InfoIcon sx={{ color: 'primary.main', cursor: 'pointer', border: `2px solid ${blue[500]}`, fontSize: 40, p: .5, borderRadius: 1 }} onClick={() => handleOpen(row)} />
                                                    </Tooltip>
                                                </TableCell>
                                                {/* {localStorage.getItem('hris_token') ? (
                                                        <TableCell sx={{ color: '#fff' }} align="left"><Button size='small' variant='contained' color="success" onClick={() => navigate(`/${process.env.REACT_APP_HOST}/user-registration`)}>Apply</Button></TableCell>
                                                    ) : null} */}
                                            </TableRow>
                                        </Fade>
                                    ))}
                                </React.Fragment>
                            )
                                : (
                                    <React.Fragment>
                                        {Array.from(Array(5)).map((item, index) => (
                                            <TableRow key={index}>
                                                {Array.from(Array(7)).map((x, i2) => (
                                                    <TableCell key={i2}><Skeleton variant='text' height={30} width="100%" /></TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </React.Fragment>
                                )}

                        </TableBody>
                    </Table>
                </TableContainer>
                {pos.length > 0 ? (
                    <Box display='flex' gap={1} mt={1}>
                        <TextField
                            label="per page"
                            value={perPage}
                            sx={{ width: '8ch' }}
                            onChange={(e) => setPerPage(e.target.value)}
                            select
                            size='small'
                        >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                        </TextField>
                        <Pagination count={Math.ceil(total / perPage)} sx={{ mt: 1 }} onChange={handlePagination} page={pages} />
                    </Box>
                ) : null}
            </Box>
        </Box>
    )
}

export default Recruitment