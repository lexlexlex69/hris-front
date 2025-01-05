import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import Badge from '@mui/material/Badge';
import { Tooltip, Typography, Pagination, Skeleton, LinearProgress, Box } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';

let controller = new AbortController()
const ClosedPositionNotif = ({ setClosePositionTrigger }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [numClosePos, setNumPosClosed] = useState('')
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const [totalExpired, setTotalExpired] = useState(0)
    // pagination 
    const [loader, setLoader] = useState(false)
    const [closeLoader, setCloseLoader] = useState(false)
    const [page, setPage] = useState(1)
    const perPage = 4
    const [total, setTotal] = useState(0)
    const handlePagination = (e, v) => {
        if (page === v) {
            return
        }
        setLoader(true)
        getClosedPositions(v)
        setPage(v)
    }

    const getClosedPositions = async (page) => {
        let res = await axios.get(`/api/recruitment/getAllClosedJobPost?page=${page}&&perPage=${perPage}`, {}, { signal: controller.abort() })
        setNumPosClosed(res.data.expired_posting.data)
        setPage(res.data.expired_posting.current_page)
        setTotal(res.data.expired_posting.total)
        setTotalExpired(res.data.total_expired)
        setLoader(false)
    }

    const handleClosePostion = async (param) => {
        setCloseLoader(true)
        try {
            let res = await axios.post(`/api/recruitment/closedJobPost`, { data: param })
            setCloseLoader(false)
            if (res.data.status === 200) {
                toast.success('Position closed!')
                getClosedPositions(1)
                setClosePositionTrigger(prev => !prev)
            }
            else if (res.data.status === 500) {
                toast.error(res.data.message)
            }
        }
        catch (err) {
            toast.error(err.message)
        }

    }
    useEffect(() => {
        getClosedPositions(page)
        return (() => controller.abort())
    }, [])
    return (
        <>
            <IconButton
                aria-label="delete"
                size='large'
                sx={{ mr: 2 }}
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                color="error"
            >
                <Tooltip title="DUED JOB VACANCIES">
                    <Badge badgeContent={totalExpired} color="error">
                        <NotificationImportantIcon sx={{ fontSize: 35 }} />
                    </Badge>
                </Tooltip>
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <Box mx={2}>
                    {closeLoader && <LinearProgress />}
                </Box>

                <TableContainer>
                    <Table sx={{ minWidth: { sx: '300px', md: '650px' } }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Position title</TableCell>
                                <TableCell align="center">Plantilla no</TableCell>
                                <TableCell align="center">Expiry date</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loader && (
                                <>
                                    {Array.from(Array(5)).map((item, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            {Array.from(Array(4)).map((items, x) => (
                                                <TableCell key={x} align="center"><Skeleton width='100%' /></TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </>
                            )}
                            {!loader && numClosePos && numClosePos?.map((item, index) => (
                                <TableRow
                                    key={item.job_vacancies_id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="center">{item?.position_title}</TableCell>
                                    <TableCell align="center">{item?.plantilla_no}</TableCell>
                                    <TableCell align="center">{moment(item?.expiry_date).format('YYYY-MM-DD')}</TableCell>
                                    <TableCell align="right"><Button variant='contained' color="error" onClick={() => handleClosePostion(item)}>Close position</Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Pagination page={page} count={Math.ceil(total / perPage)} onChange={handlePagination} />
            </Menu>
        </>
    );
};

export default React.memo(ClosedPositionNotif);