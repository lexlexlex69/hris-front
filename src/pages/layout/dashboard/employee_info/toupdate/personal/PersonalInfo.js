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

import { employeePersonalwithUpdate, handleUpdatePersonal } from './Controller'
import TableUpdates2 from '../../../../pds/family_background/TableUpdates2'
import DeclineInputs from '../DeclineInputs';

function PersonalInfo({ data, handleCloseUpdates }) {
    const [personalUpdates, setPersonalUpdates] = useState([])
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
        // console.log(data)
        setPdsParam({
            id: data.row.employee_id
        })
        let controller = new AbortController()
        employeePersonalwithUpdate(data.row.employee_id, setPersonalUpdates, setLoader, controller)
    }, [])
    return (
        <>
            {loader ? (
                <Box sx={{ height: '100%', overflowY: 'scroll', p: 2 }}>
                    <DeclineInputs open={openModal} close={handleCloseModal} data={modalData} updates={personalUpdates} setState={setPersonalUpdates} />
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableBody>
                                <TableRow className='pds-update-table-row'>
                                    <TableCell colSpan={2}>
                                        <Typography className='pds-update-table-row-color'>Surname</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className='pds-update-table-row-color'>First Name</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className='pds-update-table-row-color'>Middle Name</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className='pds-update-table-row-color'>Extension</Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ verticalAlign: 'top' }} colSpan={2}>
                                        <Typography>
                                            {personalUpdates.lname ? (<>
                                                <Typography className='pds-update-old' align="center">{personalUpdates.lname.old_value}</Typography>
                                                <Typography className='pds-update-new' align="center">{personalUpdates.lname.new_value}</Typography>
                                                <Box display='flex' justifyContent='space-between'>
                                                    <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonal(personalUpdates.lname, personalUpdates, setPersonalUpdates)}>Approve</Button>
                                                    <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalUpdates.lname, personalUpdates, setPersonalUpdates)}>Decline</Button>
                                                </Box>
                                            </>) : (
                                                <Typography sx={{ width: '100%', color: '#fff', p: 1 }} className='pds-update-noupdate' align="center">No Update</Typography>
                                            )
                                            }
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        <>
                                            {personalUpdates.fname ? (<Typography>
                                                <Typography className='pds-update-old' align="center">{personalUpdates.fname.old_value}</Typography>
                                                <Typography className='pds-update-new' align="center">{personalUpdates.fname.new_value}</Typography>
                                                <Box display='flex' justifyContent='space-between'>
                                                    <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonal(personalUpdates.fname, personalUpdates, setPersonalUpdates)}>Approve</Button>
                                                    <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalUpdates.fname)}>Decline</Button>
                                                </Box>
                                            </Typography>) : (
                                                <Typography sx={{ width: '100%', color: '#fff', p: 1 }} className='pds-update-noupdate' align="center">No Update</Typography>
                                            )}
                                        </>
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        <Typography>
                                            {personalUpdates.mname ? (<>
                                                <Typography className='pds-update-old' align="center">{personalUpdates.mname.old_value}</Typography>
                                                <Typography className='pds-update-new' align="center">{personalUpdates.mname.new_value}</Typography>
                                                <Box display='flex' justifyContent='space-between'>
                                                    <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonal(personalUpdates.mname, personalUpdates, setPersonalUpdates)}>Approve</Button>
                                                    <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalUpdates.mname)}>Decline</Button>
                                                </Box>
                                            </>) : (
                                                <Typography sx={{ width: '100%', color: '#fff', p: 1 }} className='pds-update-noupdate' align="center">No Update</Typography>
                                            )}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        <Typography>
                                            {personalUpdates.extname ? (<>
                                                <Typography className='pds-update-old' align="center">{personalUpdates.extname.old_value}</Typography>
                                                <Typography className='pds-update-new' align="center">{personalUpdates.extname.new_value}</Typography>
                                                <Box display='flex' justifyContent='space-between'>
                                                    <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonal(personalUpdates.extname, personalUpdates, setPersonalUpdates)}>Approve</Button>
                                                    <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalUpdates.extname)}>Decline</Button>
                                                </Box>
                                            </>) : (
                                                <Typography sx={{ width: '100%', color: '#fff', p: 1 }} className='pds-update-noupdate' align="center">No Update</Typography>
                                            )}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow className='pds-update-table-row'>
                                    <TableCell colSpan={2}>
                                        <Typography className='pds-update-table-row-color'>Date of Birth</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className='pds-update-table-row-color'>Place of Birth</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className='pds-update-table-row-color'>Sex</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className='pds-update-table-row-color'>Civil Status</Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ verticalAlign: 'top' }} colSpan={2}>
                                        <Typography>
                                            {personalUpdates.dob ? (<>
                                                <Typography className='pds-update-old' align="center">{personalUpdates.dob.old_value}</Typography>
                                                <Typography className='pds-update-new' align="center">{personalUpdates.dob.new_value}</Typography>
                                                <Box display='flex' justifyContent='space-between'>
                                                    <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonal(personalUpdates.dob, personalUpdates, setPersonalUpdates)}>Approve</Button>
                                                    <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalUpdates.dob)}>Decline</Button>
                                                </Box>
                                            </>) : (
                                                <Typography sx={{ width: '100%', color: '#fff', p: 1 }} className='pds-update-noupdate' align="center">No Update</Typography>
                                            )}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        <Typography>
                                            {personalUpdates.baddress ? (<>
                                                <Typography className='pds-update-old' align="center">{personalUpdates.baddress.old_value}</Typography>
                                                <Typography className='pds-update-new' align="center">{personalUpdates.baddress.new_value}</Typography>
                                                <Box display='flex' justifyContent='space-between'>
                                                    <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonal(personalUpdates.baddress, personalUpdates, setPersonalUpdates)}>Approve</Button>
                                                    <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalUpdates.baddress)}>Decline</Button>
                                                </Box>
                                            </>) : (
                                                <Typography sx={{ width: '100%', color: '#fff', p: 1 }} className='pds-update-noupdate' align="center">No Update</Typography>
                                            )}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        <Typography>
                                            {personalUpdates.sex ? (<>
                                                <Typography className='pds-update-old' align="center">{personalUpdates.sex.old_value}</Typography>
                                                <Typography className='pds-update-new' align="center">{personalUpdates.sex.new_value}</Typography>
                                                <Box display='flex' justifyContent='space-between'>
                                                    <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonal(personalUpdates.sex, personalUpdates, setPersonalUpdates)}>Approve</Button>
                                                    <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalUpdates.sex)}>Decline</Button>
                                                </Box>
                                            </>) : (
                                                <Typography sx={{ width: '100%', color: '#fff', p: 1 }} className='pds-update-noupdate' align="center">No Update</Typography>
                                            )}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        <Typography>
                                            {personalUpdates.civilstatus ? (<>
                                                <Typography className='pds-update-old' align="center">{personalUpdates.civilstatus.old_value}</Typography>
                                                <Typography className='pds-update-new' align="center">{personalUpdates.civilstatus.new_value}</Typography>
                                                <Box display='flex' justifyContent='space-between'>
                                                    <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonal(personalUpdates.civilstatus, personalUpdates, setPersonalUpdates)}>Approve</Button>
                                                    <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalUpdates.civilstatus)}>Decline</Button>
                                                </Box>
                                            </>) : (
                                                <Typography sx={{ width: '100%', color: '#fff', p: 1 }} className='pds-update-noupdate' align="center">No Update</Typography>
                                            )}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow className='pds-update-table-row'>
                                    <TableCell  >
                                        <Typography className='pds-update-table-row-color'>Citizenship</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className='pds-update-table-row-color'>Dual citizenship</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className='pds-update-table-row-color'>Height(m)</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className='pds-update-table-row-color'>Weight(kg)</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className='pds-update-table-row-color'>Blood type</Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        <Typography>
                                            {personalUpdates.citizenship ? (<>
                                                <Typography className='pds-update-old' align="center">{personalUpdates.citizenship.old_value}</Typography>
                                                <Typography className='pds-update-new' align="center">{personalUpdates.citizenship.new_value}</Typography>
                                                <Box display='flex' justifyContent='space-between'>
                                                    <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonal(personalUpdates.citizenship, personalUpdates, setPersonalUpdates)}>Approve</Button>
                                                    <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalUpdates.citizenship)}>Decline</Button>
                                                </Box>
                                            </>) : (
                                                <Typography sx={{ width: '100%', color: '#fff', p: 1 }} className='pds-update-noupdate' align="center">No Update</Typography>
                                            )}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        <Typography>
                                            {personalUpdates.dual_citizenship ? (<>
                                                <Typography className='pds-update-old' align="center">{personalUpdates.dual_citizenship.old_value}</Typography>
                                                <Typography className='pds-update-new' align="center">{personalUpdates.dual_citizenship.new_value}</Typography>
                                                <Box display='flex' justifyContent='space-between'>
                                                    <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonal(personalUpdates.dual_citizenship, personalUpdates, setPersonalUpdates)}>Approve</Button>
                                                    <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalUpdates.dual_citizenship)}>Decline</Button>
                                                </Box>
                                            </>) : (
                                                <Typography sx={{ width: '100%', color: '#fff', p: 1 }} className='pds-update-noupdate' align="center">No Update</Typography>
                                            )}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        <Typography>
                                            {personalUpdates.height ? (<>
                                                <Typography className='pds-update-old' align="center">{personalUpdates.height.old_value}</Typography>
                                                <Typography className='pds-update-new' align="center">{personalUpdates.height.new_value}</Typography>
                                                <Box display='flex' justifyContent='space-between'>
                                                    <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonal(personalUpdates.height, personalUpdates, setPersonalUpdates)}>Approve</Button>
                                                    <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalUpdates.height)}>Decline</Button>
                                                </Box>
                                            </>) : (
                                                <Typography sx={{ width: '100%', color: '#fff', p: 1 }} className='pds-update-noupdate' align="center">No Update</Typography>
                                            )}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        <Typography>
                                            {personalUpdates.weight ? (<>
                                                <Typography className='pds-update-old' align="center">{personalUpdates.weight.old_value}</Typography>
                                                <Typography className='pds-update-new' align="center">{personalUpdates.weight.new_value}</Typography>
                                                <Box display='flex' justifyContent='space-between'>
                                                    <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonal(personalUpdates.weight, personalUpdates, setPersonalUpdates)}>Approve</Button>
                                                    <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalUpdates.weight)}>Decline</Button>
                                                </Box>
                                            </>) : (
                                                <Typography sx={{ width: '100%', color: '#fff', p: 1 }} className='pds-update-noupdate' align="center">No Update</Typography>
                                            )}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        <Typography>
                                            {personalUpdates.bloodtype ? (<>
                                                <Typography className='pds-update-old' align="center">{personalUpdates.bloodtype.old_value}</Typography>
                                                <Typography className='pds-update-new' align="center">{personalUpdates.bloodtype.new_value}</Typography>
                                                <Box display='flex' justifyContent='space-between'>
                                                    <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonal(personalUpdates.bloodtype, personalUpdates, setPersonalUpdates)}>Approve</Button>
                                                    <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalUpdates.bloodtype)}>Decline</Button>
                                                </Box>
                                            </>) : (
                                                <Typography sx={{ width: '100%', color: '#fff', p: 1 }} className='pds-update-noupdate' align="center">No Update</Typography>
                                            )}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow className='pds-update-table-row'>
                                    <TableCell colSpan={2}>
                                        <Typography className='pds-update-table-row-color'>GSIS ID No.</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className='pds-update-table-row-color'>PAG-IBIG ID NO.</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className='pds-update-table-row-color'>PHILHEALTH No.</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className='pds-update-table-row-color'>SSS No.</Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ verticalAlign: 'top' }} colSpan={2}>
                                        <Typography>
                                            {personalUpdates.gsisno ? (<>
                                                <Typography className='pds-update-old' align="center">{personalUpdates.gsisno.old_value}</Typography>
                                                <Typography className='pds-update-new' align="center">{personalUpdates.gsisno.new_value}</Typography>
                                                <Box display='flex' justifyContent='space-between'>
                                                    <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonal(personalUpdates.gsisno, personalUpdates, setPersonalUpdates)}>Approve</Button>
                                                    <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalUpdates.gsisno)}>Decline</Button>
                                                </Box>
                                            </>) : (
                                                <Typography sx={{ width: '100%', color: '#fff', p: 1 }} className='pds-update-noupdate' align="center">No Update</Typography>
                                            )}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        <Typography>
                                            {personalUpdates.pag_ibig ? (<>
                                                <Typography className='pds-update-old' align="center">{personalUpdates.pag_ibig.old_value}</Typography>
                                                <Typography className='pds-update-new' align="center">{personalUpdates.pag_ibig.new_value}</Typography>
                                                <Box display='flex' justifyContent='space-between'>
                                                    <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonal(personalUpdates.pag_ibig, personalUpdates, setPersonalUpdates)}>Approve</Button>
                                                    <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalUpdates.pag_ibig)}>Decline</Button>
                                                </Box>
                                            </>) : (
                                                <Typography sx={{ width: '100%', color: '#fff', p: 1 }} className='pds-update-noupdate' align="center">No Update</Typography>
                                            )}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        <Typography>
                                            {personalUpdates.philhealth ? (<>
                                                <Typography className='pds-update-old' align="center">{personalUpdates.philhealth.old_value}</Typography>
                                                <Typography sclassName='pds-update-new' align="center">{personalUpdates.philhealth.new_value}</Typography>
                                                <Box display='flex' justifyContent='space-between'>
                                                    <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonal(personalUpdates.philhealth, personalUpdates, setPersonalUpdates)}>Approve</Button>
                                                    <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalUpdates.philhealth)}>Decline</Button>
                                                </Box>
                                            </>) : (
                                                <Typography sx={{ width: '100%', color: '#fff', p: 1 }} className='pds-update-noupdate' align="center">No Update</Typography>
                                            )}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        <Typography>
                                            {personalUpdates.sssno ? (<>
                                                <Typography className='pds-update-old' align="center">{personalUpdates.sssno.old_value}</Typography>
                                                <Typography className='pds-update-new' align="center">{personalUpdates.sssno.new_value}</Typography>
                                                <Box display='flex' justifyContent='space-between'>
                                                    <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonal(personalUpdates.sssno, personalUpdates, setPersonalUpdates)}>Approve</Button>
                                                    <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalUpdates.sssno)}>Decline</Button>
                                                </Box>
                                            </>) : (
                                                <Typography sx={{ width: '100%', color: '#fff', p: 1 }} className='pds-update-noupdate' align="center">No Update</Typography>
                                            )}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow className='pds-update-table-row'>
                                    <TableCell colSpan={2}>
                                        <Typography className='pds-update-table-row-color'>TIN No.</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className='pds-update-table-row-color'>Telephone No.</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className='pds-update-table-row-color'>Mobile No.</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className='pds-update-table-row-color'>Email Address No.</Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ verticalAlign: 'top' }} colSpan={2}>
                                        <Typography>
                                            {personalUpdates.tin ? (<>
                                                <Typography className='pds-update-old' align="center">{personalUpdates.tin.old_value}</Typography>
                                                <Typography className='pds-update-new' align="center">{personalUpdates.tin.new_value}</Typography>
                                                <Box display='flex' justifyContent='space-between'>
                                                    <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonal(personalUpdates.tin, personalUpdates, setPersonalUpdates)}>Approve</Button>
                                                    <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalUpdates.tin)}>Decline</Button>
                                                </Box>
                                            </>) : (
                                                <Typography sx={{ width: '100%', color: '#fff', p: 1 }} className='pds-update-noupdate' align="center">No Update</Typography>
                                            )}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        <Typography>
                                            {personalUpdates.telno ? (<>
                                                <Typography className='pds-update-old' align="center">{personalUpdates.telno.old_value}</Typography>
                                                <Typography className='pds-update-new' align="center">{personalUpdates.telno.new_value}</Typography>
                                                <Box display='flex' justifyContent='space-between'>
                                                    <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonal(personalUpdates.telno, personalUpdates, setPersonalUpdates)}>Approve</Button>
                                                    <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalUpdates.telno)}>Decline</Button>
                                                </Box>
                                            </>) : (
                                                <Typography sx={{ width: '100%', color: '#fff', p: 1 }} className='pds-update-noupdate' align="center">No Update</Typography>
                                            )}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        <Typography>
                                            {personalUpdates.cpno ? (<>
                                                <Typography className='pds-update-old' align="center">{personalUpdates.cpno.old_value}</Typography>
                                                <Typography className='pds-update-new' align="center">{personalUpdates.cpno.new_value}</Typography>
                                                <Box display='flex' justifyContent='space-between'>
                                                    <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonal(personalUpdates.cpno, personalUpdates, setPersonalUpdates)}>Approve</Button>
                                                    <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalUpdates.cpno)}>Decline</Button>
                                                </Box>
                                            </>) : (
                                                <Typography sx={{ width: '100%', color: '#fff', p: 1 }} className='pds-update-noupdate' align="center">No Update</Typography>
                                            )}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        <Typography>
                                            {personalUpdates.emailadd ? (<>
                                                <Typography className='pds-update-old' align="center">{personalUpdates.emailadd.old_value}</Typography>
                                                <Typography className='pds-update-new' align="center">{personalUpdates.emailadd.new_value}</Typography>
                                                <Box display='flex' justifyContent='space-between'>
                                                    <Button variant='contained' size="small" className='pds-update-btn' onClick={() => handleUpdatePersonal(personalUpdates.emailadd, personalUpdates, setPersonalUpdates)}>Approve</Button>
                                                    <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(personalUpdates.emailadd)}>Decline</Button>
                                                </Box>
                                            </>) : (
                                                <Typography sx={{ width: '100%', color: '#fff', p: 1 }} className='pds-update-noupdate' align="center">No Update</Typography>
                                            )}
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            ) : (
                <SkeletonComponent />
            )}
        </>
    )
}

export default PersonalInfo