import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import SkeletonComponent from '../SkeletonComponent';

import { getGidUpdates, confirmGid } from './Controller';
import DeclineInputs from '../DeclineInputs';

function Govid({ data }) {
    const [gidUpdates, setGidUpdates] = useState([])
    const [loader, setLoader] = useState(false)

    // decline
    const [openModal, setOpenModal] = useState(false)
    const [modalData, setModalData] = useState(false)
    const handleOpenModal = (param) => {
        setModalData(param)
        setOpenModal(true)
    }
    const handleCloseModal = () => setOpenModal(false)
    // decline

    useEffect(() => {
        let controller = new AbortController()
        getGidUpdates(data.row.employee_id, setGidUpdates, setLoader, controller)
    }, [])
    return (
        <Box sx={{ p: 2 }}>
            {loader ? (
                <TableContainer component={Paper}>
                    <DeclineInputs open={openModal} close={handleCloseModal} data={modalData} updates={gidUpdates} setState={setGidUpdates} />
                    <Table size="small">
                        <TableRow className='pds-update-table-row'>
                            <TableCell>
                                <Typography className='pds-update-table-row-color'>
                                    Goverment Issued ID
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <TableCell>
                                    <Typography className='pds-update-table-row-color'>
                                        Id/License/Passport No.
                                    </Typography>
                                </TableCell>
                            </TableCell>
                            <TableCell>
                                <TableCell>
                                    <Typography className='pds-update-table-row-color'>
                                        Date/Place of Issuance
                                    </Typography>
                                </TableCell>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ verticalAlign: 'top' }}>
                                <Typography>
                                    {gidUpdates.gov_id ? (<>
                                        <Typography className='pds-update-old' align="center">{gidUpdates.gov_id.old_value ? gidUpdates.gov_id.old_value : '-'}</Typography>
                                        <Typography className='pds-update-new' align="center">{gidUpdates.gov_id.new_value}</Typography>
                                        <Box display='flex' justifyContent='space-between'>
                                            <Button variant='contained' size="small" className='pds-update-btn' onClick={() => confirmGid(gidUpdates.gov_id, gidUpdates, setGidUpdates)}>Approve</Button>
                                            <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(gidUpdates.gov_id, gidUpdates, setGidUpdates)}>Decline</Button>
                                        </Box>
                                    </>) : (
                                        <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                                    )
                                    }
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ verticalAlign: 'top' }}>
                                <Typography>
                                    {gidUpdates.id_no ? (<>
                                        <Typography className='pds-update-old' align="center">{gidUpdates.id_no.old_value ? gidUpdates.id_no.old_value : '-'}</Typography>
                                        <Typography className='pds-update-new' align="center">{gidUpdates.id_no.new_value}</Typography>
                                        <Box display='flex' justifyContent='space-between'>
                                            <Button variant='contained' size="small" className='pds-update-btn' onClick={() => confirmGid(gidUpdates.id_no, gidUpdates, setGidUpdates)}>Approve</Button>
                                            <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(gidUpdates.id_no, gidUpdates, setGidUpdates)}>Decline</Button>
                                        </Box>
                                    </>) : (
                                        <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                                    )
                                    }
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ verticalAlign: 'top' }}>
                                <Typography>
                                    {gidUpdates.date_place_issuance ? (<>
                                        <Typography className='pds-update-old' align="center">{gidUpdates.date_place_issuance.old_value ? gidUpdates.date_place_issuance.old_value : '-'}</Typography>
                                        <Typography className='pds-update-new' align="center">{gidUpdates.date_place_issuance.new_value}</Typography>
                                        <Box display='flex' justifyContent='space-between'>
                                            <Button variant='contained' size="small" className='pds-update-btn' onClick={() => confirmGid(gidUpdates.date_place_issuance, gidUpdates, setGidUpdates)}>Approve</Button>
                                            <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(gidUpdates.date_place_issuance, gidUpdates, setGidUpdates)}>Decline</Button>
                                        </Box>
                                    </>) : (
                                        <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                                    )
                                    }
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </Table>
                </TableContainer>
            ) : (<SkeletonComponent />)}
        </Box>
    )
}

export default Govid