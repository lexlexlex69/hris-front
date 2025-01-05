import { Container, Pagination, Typography, Button, IconButton, TextField, Skeleton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import { green, orange, red } from '@mui/material/colors';
import Paper from '@mui/material/Paper';
import CustomBackdrop from './componentsByStatus/CustomBackdrop';
import AddIcon from '@mui/icons-material/Add'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import EditIcon from '@mui/icons-material/Edit'
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteIcon from '@mui/icons-material/Delete'
import axios from 'axios';
import { toast } from 'react-toastify';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import Swal from 'sweetalert2';

const Venue = () => {
    const [venue, setVenue] = useState([])
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [tableLoader, setTableLoader] = useState(true)
    const [venueName, setVenueName] = useState('')
    const [openAddVenue, setOpenAddVenue] = useState(false)
    const [addBackdrop, setAddBackdrop] = useState(false)
    const [updateBackdrop, setUpdateBackdrop] = useState(false)
    const [deleteBackdrop, setDeleteBackdrop] = useState(false)
    const perPage = 5
    const [addLoader, setAddLoader] = useState(false)

    const [isUpdate, setIsUpdate] = useState(false)
    const [updateData, setUpdateData] = useState({})
    const [updateIndex, setUpdateIndex] = useState('')
    const fetchVenue = async (controller, page) => {
        const res = await axios.post(`/api/recruitment/jobPosting/getVenue?page=${page}&&paginate=true&&perPage=${perPage}`, {}, { signal: controller.signal })
        setTableLoader(false)
        setVenue(res.data.data)
        setPage(res.data.current_page)
        setTotal(res.data.total)
    }
    const handlePaginate = (e, v) => {
        setTableLoader(true)
        let controller = new AbortController()
        setPage(v)
        fetchVenue(controller, v)
    }

    const handleSubmitAdd = async (e) => {
        e.preventDefault();
        setAddLoader(true)
        setAddBackdrop(true)
        try {
            const res = await axios.post(`/api/recruitment/jobPosting/addVenue`, { venue_name: venueName })
            setAddLoader(false)
            setAddBackdrop(false)
            if (res.data.status === 200) {
                toast.success('Venue Added')
                setVenueName('')
                let newVenue = [...venue]
                newVenue.unshift({
                    venue_name: venueName,
                    venue_order: res.data.venue_order
                })
                newVenue = newVenue.slice(0, perPage)
                setVenue(newVenue)
                setTotal(prev => prev + 1)
                setOpenAddVenue(false)
            }
            else if (res.data.status === 500) {
                toast.error(res.data.message)
            }
        }
        catch (err) {
            toast.error(err.message)
        }

    }
    const handleDelete = async (row) => {
        let controller = new AbortController()
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setDeleteBackdrop(true)
                    const res = await axios.post(`/api/recruitment/jobPosting/deleteVenue`, row)
                    setDeleteBackdrop(false)
                    if (res.data.status === 200) {
                        toast.success('Deleted!')
                        let newVenue = venue.filter((item) => item.id !== row.id)
                        setTableLoader(true)
                        fetchVenue(controller, page)
                    }
                    else if (res.data.status === 500) {
                        toast.error(res.data.message)
                    }
                }
                catch (err) {
                    toast.error(err.message)
                }
            }
        })
    }

    const handleUpdate = (row, index) => {
        setUpdateIndex(index)
        setUpdateData(row)
        setIsUpdate(true)
    }

    const handleUpdateSubmit = async (row) => {
        if (row.venue_name === updateData.venue_name) {
            toast.warning('Nothing to update!')
            return
        }
        try {
            setUpdateBackdrop(true)
            const res = await axios.post(`/api/recruitment/jobPosting/updateVenue`, updateData)
            setUpdateBackdrop(false)
            if (res.data.status === 200) {
                let newVenue = venue.map((item) => row.id === item.id ? ({ ...item, venue_name: updateData.venue_name }) : item)
                setVenue(newVenue)
                setIsUpdate(false)
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
        let controller = new AbortController()
        fetchVenue(controller, page)
        return (() => controller.abort())
    }, [])
    return (
        <Container maxWidth='md' sx={{ pt: 2 }}>
            <CustomBackdrop open={addBackdrop} title="Adding Venue" />
            <CustomBackdrop open={deleteBackdrop} title="Deleting Venue" />
            <CustomBackdrop open={updateBackdrop} title="Updating Venue" />
            {/* <Box display='flex'>
                <Button variant="contained" sx={{ borderRadius: '2rem' }} color={openAddVenue ? "error" : "primary"} startIcon={openAddVenue ? <DoNotDisturbIcon /> : <AddIcon />} onClick={() => setOpenAddVenue(prev => !prev)}>
                    {!openAddVenue && 'Add Venue'}
                    {openAddVenue && 'Cancel'}
                </Button>
            </Box> */}
            <form onSubmit={handleSubmitAdd}>
                <Box display='flex' alignItems='center' sx={{ px: { xs: 1, md: 0, gap: 5 } }}>
                    <TextField
                        fullWidth
                        id=""
                        label="Venue/Office/Building name"
                        size='small'
                        disabled={!openAddVenue}
                        value={venueName}
                        onChange={(e) => setVenueName(e.target.value)}
                        required
                    />
                    <Button type='submit'>
                        <AddIcon type='button' sx={{ fontSize: 35, borderRadius: '100%', bgcolor: 'primary.main', color: '#fff' }} />
                    </Button>
                </Box>
            </form>
            <hr />
            <TableContainer >
                <Table aria-label="simple table" size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell align='left'>VENUE NAME</TableCell>
                            <TableCell align='right'>ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableLoader ? (
                            <>
                                {Array.from(Array(5)).map((x, i) => (
                                    <TableRow key={i}>
                                        {Array.from(Array(2)).map((y, i2) => (
                                            <TableCell key={i2} component="th" scope="row" align='left'><Skeleton height={35} /></TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </>
                        ) : (
                            <>
                                {venue && venue.map((row, index) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" align='left'>
                                            {isUpdate && updateIndex === index ? (<>
                                                <TextField
                                                    label="Update venue"
                                                    value={updateData?.venue_name}
                                                    size='small'
                                                    fullWidth
                                                    onChange={(e) => setUpdateData(prev => ({ ...prev, venue_name: e.target.value }))}
                                                />
                                            </>) : (
                                                <>{row.venue_name}</>
                                            )}
                                        </TableCell>
                                        <TableCell align='right'>
                                            {isUpdate && updateIndex === index &&
                                                (
                                                    <IconButton size='small' sx={{ border: `2px solid ${green[500]}`, color: green[500], '&:hover': { color: green[700] }, mr: 1 }} onClick={() => handleUpdateSubmit(row)}>
                                                        <DoneAllIcon />
                                                    </IconButton>
                                                )
                                            }

                                            <IconButton size='small' sx={{ border: `2px solid ${isUpdate && updateIndex === index ? red[500] : orange[500]}`, color: isUpdate && updateIndex === index ? red[500] : orange[500], '&:hover': { color: isUpdate && updateIndex === index ? red[500] : orange[700] } }} onClick={() => isUpdate ? setIsUpdate(false) : handleUpdate(row, index)}>
                                                {isUpdate && updateIndex === index ? <DoNotDisturbIcon /> : <EditIcon />}
                                            </IconButton>
                                            <IconButton size='small' sx={{ border: `2px solid ${red[500]}`, color: red[500], '&:hover': { color: red[700] }, ml: 1 }} onClick={() => handleDelete(row)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>
                        )}

                    </TableBody>
                </Table>
            </TableContainer>
            <Box display="flex" mt={2}>
                <Pagination variant='outlined' color='primary' page={page} count={Math.ceil(total / perPage)} onChange={handlePaginate} />
            </Box>
        </Container>
    );
};

export default Venue;