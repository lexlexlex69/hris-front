import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

import SkeletonComponent from '../SkeletonComponent';
import { employeePersonalwithUpdate, handleUpdatePersonalAddress } from './Controller'
import DeclineInputs from '../DeclineInputs';

function PersonalAddress({ data, handleCloseUpdates }) {
    const [personalAddressUpdates, setPersonalAddressUpdates] = useState([])
    const [loader, setLoader] = useState(false)
    const [pdsParam, setPdsParam] = useState({
        id: ''
    })

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
        setPdsParam({
            id: data.row.employee_id
        })
        let controller = new AbortController()
        employeePersonalwithUpdate(data.row.employee_id, setPersonalAddressUpdates, setLoader, controller)
    }, [])
    return (
        <>
            {loader ? (
                <Box sx={{ height: '100%', overflowY: 'scroll', p: 2 }}>
                    <DeclineInputs open={openModal} close={handleCloseModal} data={modalData} updates={personalAddressUpdates} setState={setPersonalAddressUpdates} />
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <Typography align="center" color="primary">Residential Address</Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow className='pds-update-table-row'>
                                    <TableCell >
                                        <Typography className='pds-update-table-row-color'>
                                            House/Block No.
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className='pds-update-table-row-color'>
                                            Street
                                        </Typography>
                                    </TableCell>
                                    <TableCell >
                                        <Typography className='pds-update-table-row-color'>
                                            Subdivision/Village
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className='pds-update-table-row-color'>
                                            Barangay
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        {personalAddressUpdates.radUnit ? (<>
                                            <Typography className='pds-update-old' align="center">{personalAddressUpdates.radUnit.old_value}</Typography>
                                            <Typography className='pds-update-new' align="center">{personalAddressUpdates.radUnit.new_value}</Typography>
                                            <Box display='flex' justifyContent='space-between'>
                                                <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonalAddress(personalAddressUpdates.radUnit, personalAddressUpdates, setPersonalAddressUpdates)}>Approve</Button>
                                                <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalAddressUpdates.radUnit, personalAddressUpdates, setPersonalAddressUpdates)}>Decline</Button>
                                            </Box>
                                        </>) : (
                                            <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        {personalAddressUpdates.radStreet ? (<>
                                            <Typography className='pds-update-old' align="center">{personalAddressUpdates.radStreet.old_value}</Typography>
                                            <Typography className='pds-update-new' align="center">{personalAddressUpdates.radStreet.new_value}</Typography>
                                            <Box display='flex' justifyContent='space-between'>
                                                <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonalAddress(personalAddressUpdates.radStreet, personalAddressUpdates, setPersonalAddressUpdates)}>Approve</Button>
                                                <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalAddressUpdates.radStreet, personalAddressUpdates, setPersonalAddressUpdates)}>Decline</Button>
                                            </Box>
                                        </>) : (
                                            <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        {personalAddressUpdates.radVillage ? (<>
                                            <Typography className='pds-update-old' align="center">{personalAddressUpdates.radVillage.old_value}</Typography>
                                            <Typography className='pds-update-new' align="center">{personalAddressUpdates.radVillage.new_value}</Typography>
                                            <Box display='flex' justifyContent='space-between'>
                                                <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonalAddress(personalAddressUpdates.radVillage, personalAddressUpdates, setPersonalAddressUpdates)}>Approve</Button>
                                                <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalAddressUpdates.radVillage, personalAddressUpdates, setPersonalAddressUpdates)}>Decline</Button>
                                            </Box>
                                        </>) : (
                                            <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        {personalAddressUpdates.radBrgy ? (<>
                                            <Typography className='pds-update-old' align="center">{personalAddressUpdates.radBrgy.old_value}</Typography>
                                            <Typography className='pds-update-new' align="center">{personalAddressUpdates.radBrgy.new_value}</Typography>
                                            <Box display='flex' justifyContent='space-between'>
                                                <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonalAddress(personalAddressUpdates.radBrgy, personalAddressUpdates, setPersonalAddressUpdates)}>Approve</Button>
                                                <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalAddressUpdates.radBrgy, personalAddressUpdates, setPersonalAddressUpdates)}>Decline</Button>
                                            </Box>
                                        </>) : (
                                            <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow className='pds-update-table-row'>
                                    <TableCell>
                                        <Typography className='pds-update-table-row-color'>
                                            Municipality/City
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className='pds-update-table-row-color'>
                                            Province
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className='pds-update-table-row-color'>
                                            Region
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className='pds-update-table-row-color'>
                                            Zipcode
                                        </Typography>

                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        {personalAddressUpdates.radCity ? (<>
                                            <Typography className='pds-update-old' align="center">{personalAddressUpdates.radCity.old_value}</Typography>
                                            <Typography className='pds-update-new' align="center">{personalAddressUpdates.radCity.new_value}</Typography>
                                            <Box display='flex' justifyContent='space-between'>
                                                <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonalAddress(personalAddressUpdates.radCity, personalAddressUpdates, setPersonalAddressUpdates)}>Approve</Button>
                                                <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalAddressUpdates.radCity, personalAddressUpdates, setPersonalAddressUpdates)}>Decline</Button>
                                            </Box>
                                        </>) : (
                                            <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        {personalAddressUpdates.radProvince ? (<>
                                            <Typography className='pds-update-old' align="center">{personalAddressUpdates.radProvince.old_value}</Typography>
                                            <Typography className='pds-update-new' align="center">{personalAddressUpdates.radProvince.new_value}</Typography>
                                            <Box display='flex' justifyContent='space-between'>
                                                <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonalAddress(personalAddressUpdates.radProvince, personalAddressUpdates, setPersonalAddressUpdates)}>Approve</Button>
                                                <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalAddressUpdates.radProvince, personalAddressUpdates, setPersonalAddressUpdates)}>Decline</Button>
                                            </Box>
                                        </>) : (
                                            <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        {personalAddressUpdates.radRegion ? (<>
                                            <Typography className='pds-update-old' align="center">{personalAddressUpdates.radRegion.old_value}</Typography>
                                            <Typography className='pds-update-new' align="center">{personalAddressUpdates.radRegion.new_value}</Typography>
                                            <Box display='flex' justifyContent='space-between'>
                                                <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonalAddress(personalAddressUpdates.radRegion, personalAddressUpdates, setPersonalAddressUpdates)}>Approve</Button>
                                                <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalAddressUpdates.radRegion, personalAddressUpdates, setPersonalAddressUpdates)}>Decline</Button>
                                            </Box>
                                        </>) : (
                                            <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        {personalAddressUpdates.radZip ? (<>
                                            <Typography className='pds-update-old' align="center">{personalAddressUpdates.radZip.old_value}</Typography>
                                            <Typography className='pds-update-new' align="center">{personalAddressUpdates.radZip.new_value}</Typography>
                                            <Box display='flex' justifyContent='space-between'>
                                                <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonalAddress(personalAddressUpdates.radZip, personalAddressUpdates, setPersonalAddressUpdates)}>Approve</Button>
                                                <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalAddressUpdates.radZip, personalAddressUpdates, setPersonalAddressUpdates)}>Decline</Button>
                                            </Box>
                                        </>) : (
                                            <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TableContainer component={Paper} sx={{ mt: 3 }}>
                        <Table size="small">
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <Typography align="center" color="primary">Permanent Address</Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow className='pds-update-table-row'>
                                    <TableCell >
                                        <Typography className='pds-update-table-row-color'>
                                            House/Block No.
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className='pds-update-table-row-color'>
                                            Street
                                        </Typography>
                                    </TableCell>
                                    <TableCell >
                                        <Typography className='pds-update-table-row-color'>
                                            Subdivision/Village
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className='pds-update-table-row-color'>
                                            Barangay
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        {personalAddressUpdates.padUnit ? (<>
                                            <Typography className='pds-update-old' align="center">{personalAddressUpdates.padUnit.old_value ? personalAddressUpdates.padUnit.old_value : 'N/A'}</Typography>
                                            <Typography className='pds-update-new' align="center">{personalAddressUpdates.padUnit.new_value}</Typography>
                                            <Box display='flex' justifyContent='space-between'>
                                                <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonalAddress(personalAddressUpdates.padUnit, personalAddressUpdates, setPersonalAddressUpdates)}>Approve</Button>
                                                <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalAddressUpdates.padUnit, personalAddressUpdates, setPersonalAddressUpdates)}>Decline</Button>
                                            </Box>
                                        </>) : (
                                            <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        {personalAddressUpdates.padStreet ? (<>
                                            <Typography className='pds-update-old' align="center">{personalAddressUpdates.padStreet.old_value}</Typography>
                                            <Typography className='pds-update-new' align="center">{personalAddressUpdates.padStreet.new_value}</Typography>
                                            <Box display='flex' justifyContent='space-between'>
                                                <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonalAddress(personalAddressUpdates.padStreet, personalAddressUpdates, setPersonalAddressUpdates)}>Approve</Button>
                                                <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalAddressUpdates.padStreet, personalAddressUpdates, setPersonalAddressUpdates)}>Decline</Button>
                                            </Box>
                                        </>) : (
                                            <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        {personalAddressUpdates.padVillage ? (<>
                                            <Typography className='pds-update-old' align="center">{personalAddressUpdates.padVillage.old_value}</Typography>
                                            <Typography className='pds-update-new' align="center">{personalAddressUpdates.padVillage.new_value}</Typography>
                                            <Box display='flex' justifyContent='space-between'>
                                                <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonalAddress(personalAddressUpdates.padVillage, personalAddressUpdates, setPersonalAddressUpdates)}>Approve</Button>
                                                <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalAddressUpdates.padVillage, personalAddressUpdates, setPersonalAddressUpdates)}>Decline</Button>
                                            </Box>
                                        </>) : (
                                            <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        {personalAddressUpdates.padBrgy ? (<>
                                            <Typography className='pds-update-old' align="center">{personalAddressUpdates.padBrgy.old_value}</Typography>
                                            <Typography className='pds-update-new' align="center">{personalAddressUpdates.padBrgy.new_value}</Typography>
                                            <Box display='flex' justifyContent='space-between'>
                                                <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonalAddress(personalAddressUpdates.padBrgy, personalAddressUpdates, setPersonalAddressUpdates)}>Approve</Button>
                                                <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalAddressUpdates.padBrgy, personalAddressUpdates, setPersonalAddressUpdates)}>Decline</Button>
                                            </Box>
                                        </>) : (
                                            <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow className='pds-update-table-row'>
                                    <TableCell>
                                        <Typography className='pds-update-table-row-color'>
                                            Municipality/City
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className='pds-update-table-row-color'>
                                            Province
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className='pds-update-table-row-color'>
                                            Region
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className='pds-update-table-row-color'>
                                            Zipcode
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        {personalAddressUpdates.padCity ? (<>
                                            <Typography className='pds-update-old' align="center">{personalAddressUpdates.padCity.old_value}</Typography>
                                            <Typography className='pds-update-new' align="center">{personalAddressUpdates.padCity.new_value}</Typography>
                                            <Box display='flex' justifyContent='space-between'>
                                                <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonalAddress(personalAddressUpdates.padCity, personalAddressUpdates, setPersonalAddressUpdates)}>Approve</Button>
                                                <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalAddressUpdates.padCity, personalAddressUpdates, setPersonalAddressUpdates)}>Decline</Button>
                                            </Box>
                                        </>) : (
                                            <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        {personalAddressUpdates.padProvince ? (<>
                                            <Typography className='pds-update-old' align="center">{personalAddressUpdates.padProvince.old_value}</Typography>
                                            <Typography className='pds-update-new' align="center">{personalAddressUpdates.padProvince.new_value}</Typography>
                                            <Box display='flex' justifyContent='space-between'>
                                                <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonalAddress(personalAddressUpdates.padProvince, personalAddressUpdates, setPersonalAddressUpdates)}>Approve</Button>
                                                <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalAddressUpdates.padProvince, personalAddressUpdates, setPersonalAddressUpdates)}>Decline</Button>
                                            </Box>
                                        </>) : (
                                            <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        {personalAddressUpdates.padRegion ? (<>
                                            <Typography className='pds-update-old' align="center">{personalAddressUpdates.padRegion.old_value}</Typography>
                                            <Typography className='pds-update-new' align="center">{personalAddressUpdates.padRegion.new_value}</Typography>
                                            <Box display='flex' justifyContent='space-between'>
                                                <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonalAddress(personalAddressUpdates.padRegion, personalAddressUpdates, setPersonalAddressUpdates)}>Approve</Button>
                                                <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalAddressUpdates.padRegion, personalAddressUpdates, setPersonalAddressUpdates)}>Decline</Button>
                                            </Box>
                                        </>) : (
                                            <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }} >
                                        {personalAddressUpdates.padZip ? (<>
                                            <Typography className='pds-update-old' align="center">{personalAddressUpdates.padZip.old_value}</Typography>
                                            <Typography className='pds-update-new' align="center">{personalAddressUpdates.padZip.new_value}</Typography>
                                            <Box display='flex' justifyContent='space-between'>
                                                <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonalAddress(personalAddressUpdates.padZip, personalAddressUpdates, setPersonalAddressUpdates)}>Approve</Button>
                                                <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalAddressUpdates.padZip, personalAddressUpdates, setPersonalAddressUpdates)}>Decline</Button>
                                            </Box>
                                        </>) : (
                                            <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            ) : (<SkeletonComponent />)}
        </>
    )
}

export default PersonalAddress