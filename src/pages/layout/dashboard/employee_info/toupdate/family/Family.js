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

import { getEmployeeWithUpdates, updateFamilyInfo } from './Controller'
import TableUpdates from '../../../../pds/eligibility/TableUpdates'
import DeclineInputs from '../DeclineInputs';

function Family({ data, handleCloseUpdates }) {

  const [familyUpdates, setFamilyUpdates] = useState([])
  const [family, setFamily] = useState([])
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
    getEmployeeWithUpdates(data.row.employee_id, setFamily, setFamilyUpdates, setLoader, controller)
  }, [])
  return (
    <>
      {loader ? (
        <Box sx={{ mt: 1, height: '100%', overflowY: 'scroll', p: 2 }}>
          <DeclineInputs open={openModal} close={handleCloseModal} data={modalData} updates={familyUpdates} setState={setFamilyUpdates} />
          <TableContainer component={Paper}>
            <Table aria-label="simple table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ color: 'primary.main' }} colSpan={4}>Spouse Information</TableCell>
                </TableRow>
                <TableRow className='pds-update-table-row'>
                  <TableCell align="center" width="25%" className='pds-update-table-row-color'>Surname</TableCell>
                  <TableCell align="center" width="25%" className='pds-update-table-row-color'>First Name</TableCell>
                  <TableCell align="center" width="25%" className='pds-update-table-row-color'>Middle Name</TableCell>
                  <TableCell align="center" width="25%" className='pds-update-table-row-color'>Name Extension</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" sx={{ verticalAlign: 'top' }}>
                    {familyUpdates.spouse_surname ? (<>
                      <Typography className='pds-update-old'>{familyUpdates.spouse_surname.old_value}</Typography>
                      <Typography className='pds-update-new'>{familyUpdates.spouse_surname.new_value}</Typography>
                      <Box display='flex' justifyContent='space-between'>
                        <Button variant='contained' size="small" className='pds-update-btn' onClick={() => updateFamilyInfo(familyUpdates.spouse_surname, familyUpdates, setFamilyUpdates)}>Approve</Button>
                        <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(familyUpdates.spouse_surname, familyUpdates, setFamilyUpdates)}>Decline</Button>
                      </Box>
                    </>) : (
                      <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ verticalAlign: 'top' }}>
                    {familyUpdates.spouse_fname ? (<>
                      <Typography className='pds-update-old'>{familyUpdates.spouse_fname.old_value}</Typography>
                      <Typography className='pds-update-new'>{familyUpdates.spouse_fname.new_value}</Typography>
                      <Box display='flex' justifyContent='space-between'>
                        <Button variant='contained' size="small" className='pds-update-btn' onClick={() => updateFamilyInfo(familyUpdates.spouse_fname, familyUpdates, setFamilyUpdates)}>Approve</Button>
                        <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(familyUpdates.spouse_fname, familyUpdates, setFamilyUpdates)}>Decline</Button>
                      </Box>
                    </>) : (
                      <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ verticalAlign: 'top' }}>
                    {familyUpdates.spouse_mname ? (<>
                      <Typography className='pds-update-old'>{familyUpdates.spouse_mname.old_value}</Typography>
                      <Typography className='pds-update-new'>{familyUpdates.spouse_mname.new_value}</Typography>
                      <Box display='flex' justifyContent='space-between'>
                        <Button variant='contained' size="small" className='pds-update-btn' onClick={() => updateFamilyInfo(familyUpdates.spouse_mname, familyUpdates, setFamilyUpdates)}>Approve</Button>
                        <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(familyUpdates.spouse_mname, familyUpdates, setFamilyUpdates)}>Decline</Button>
                      </Box>
                    </>) : (
                      <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ verticalAlign: 'top' }}>
                    {familyUpdates.spouse_extn ? (<>
                      <Typography className='pds-update-old'>{familyUpdates.spouse_extn.old_value}</Typography>
                      <Typography className='pds-update-new'>{familyUpdates.spouse_extn.new_value}</Typography>
                      <Box display='flex' justifyContent='space-between'>
                        <Button variant='contained' size="small" className='pds-update-btn' onClick={() => updateFamilyInfo(familyUpdates.spouse_extn, familyUpdates, setFamilyUpdates)}>Approve</Button>
                        <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(familyUpdates.spouse_extn, familyUpdates, setFamilyUpdates)}>Decline</Button>
                      </Box>
                    </>) : (
                      <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          {/*  */}
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table aria-label="simple table" size="small">
              <TableHead>
                <TableRow>
                  {/* <TableCell align="center" sx={{ color: 'primary.main' }} colSpan={4}>Father's Information</TableCell> */}
                </TableRow>
                <TableRow className='pds-update-table-row'>
                  <TableCell align="center" className='pds-update-table-row-color' width="25%">Occupation</TableCell>
                  <TableCell align="center" className='pds-update-table-row-color' width="25%">Employer name</TableCell>
                  <TableCell align="center" className='pds-update-table-row-color' width="25%">Employer address</TableCell>
                  <TableCell align="center" className='pds-update-table-row-color' width="25%">Telephone number</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" sx={{ verticalAlign: 'top' }}>
                    {familyUpdates.occupation ? (<>
                      <Typography className='pds-update-old'>{familyUpdates.occupation.old_value}</Typography>
                      <Typography className='pds-update-new'>{familyUpdates.occupation.new_value}</Typography>
                      <Box display='flex' justifyContent='space-between'>
                        <Button size="small" variant='contained' className='pds-update-btn' onClick={() => updateFamilyInfo(familyUpdates.occupation, familyUpdates, setFamilyUpdates)}>Approve</Button>
                        <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(familyUpdates.occupation, familyUpdates, setFamilyUpdates)}>Decline</Button>
                      </Box>
                    </>) : (
                      <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ verticalAlign: 'top' }}>
                    {familyUpdates.employeer_name ? (<>
                      <Typography className='pds-update-old'>{familyUpdates.employeer_name.old_value}</Typography>
                      <Typography className='pds-update-new'>{familyUpdates.employeer_name.new_value}</Typography>
                      <Box display='flex' justifyContent='space-between'>
                        <Button size="small" variant='contained' className='pds-update-btn' onClick={() => updateFamilyInfo(familyUpdates.employeer_name, familyUpdates, setFamilyUpdates)}>Approve</Button>
                        <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(familyUpdates.employeer_name, familyUpdates, setFamilyUpdates)}>Decline</Button>
                      </Box>
                    </>) : (
                      <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ verticalAlign: 'top' }}>
                    {familyUpdates.emp_address ? (<>
                      <Typography className='pds-update-old'>{familyUpdates.emp_address.old_value}</Typography>
                      <Typography className='pds-update-new'>{familyUpdates.emp_address.new_value}</Typography>
                      <Box display='flex' justifyContent='space-between'>
                        <Button size="small" variant='contained' className='pds-update-btn' onClick={() => updateFamilyInfo(familyUpdates.emp_address, familyUpdates, setFamilyUpdates)}>Approve</Button>
                        <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(familyUpdates.emp_address, familyUpdates, setFamilyUpdates)}>Decline</Button>
                      </Box>
                    </>) : (
                      <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ verticalAlign: 'top' }}>
                    {familyUpdates.tel_no ? (<>
                      <Typography className='pds-update-old'>{familyUpdates.tel_no.old_value}</Typography>
                      <Typography className='pds-update-new'>{familyUpdates.tel_no.new_value}</Typography>
                      <Box display='flex' justifyContent='space-between'>
                        <Button size="small" variant='contained' className='pds-update-btn' onClick={() => updateFamilyInfo(familyUpdates.tel_no, familyUpdates, setFamilyUpdates)}>Approve</Button>
                        <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(familyUpdates.tel_no, familyUpdates, setFamilyUpdates)}>Decline</Button>
                      </Box>
                    </>) : (
                      <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          {/*  */}
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table aria-label="simple table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ color: 'primary.main' }} colSpan={4}>Father's Information</TableCell>
                </TableRow>
                <TableRow className='pds-update-table-row'>
                  <TableCell align="center" className='pds-update-table-row-color' width="25%">Surname</TableCell>
                  <TableCell align="center" className='pds-update-table-row-color' width="25%">First Name</TableCell>
                  <TableCell align="center" className='pds-update-table-row-color' width="25%">Middle Name</TableCell>
                  <TableCell align="center" className='pds-update-table-row-color' width="25%">Name Extension</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" sx={{ verticalAlign: 'top' }}>
                    {familyUpdates.father_surname ? (<>
                      <Typography className='pds-update-old'>{familyUpdates.father_surname.old_value}</Typography>
                      <Typography className='pds-update-new'>{familyUpdates.father_surname.new_value}</Typography>
                      <Box display='flex' justifyContent='space-between'>
                        <Button size="small" variant='contained' className='pds-update-btn' onClick={() => updateFamilyInfo(familyUpdates.father_surname, familyUpdates, setFamilyUpdates)}>Approve</Button>
                        <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(familyUpdates.father_surname, familyUpdates, setFamilyUpdates)}>Decline</Button>
                      </Box>
                    </>) : (
                      <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ verticalAlign: 'top' }}>
                    {familyUpdates.father_fname ? (<>
                      <Typography className='pds-update-old'>{familyUpdates.father_fname.old_value}</Typography>
                      <Typography className='pds-update-new'>{familyUpdates.father_fname.new_value}</Typography>
                      <Box display='flex' justifyContent='space-between'>
                        <Button size="small" variant='contained' className='pds-update-btn' onClick={() => updateFamilyInfo(familyUpdates.father_fname, familyUpdates, setFamilyUpdates)}>Approve</Button>
                        <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(familyUpdates.father_fname, familyUpdates, setFamilyUpdates)}>Decline</Button>
                      </Box>
                    </>) : (
                      <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ verticalAlign: 'top' }}>
                    {familyUpdates.father_mname ? (<>
                      <Typography className='pds-update-old'>{familyUpdates.father_mname.old_value}</Typography>
                      <Typography className='pds-update-new'>{familyUpdates.father_mname.new_value}</Typography>
                      <Box display='flex' justifyContent='space-between'>
                        <Button size="small" variant='contained' className='pds-update-btn' onClick={() => updateFamilyInfo(familyUpdates.father_mname, familyUpdates, setFamilyUpdates)}>Approve</Button>
                        <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(familyUpdates.father_mname, familyUpdates, setFamilyUpdates)}>Decline</Button>
                      </Box>
                    </>) : (
                      <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ verticalAlign: 'top' }}>
                    {familyUpdates.father_extn ? (<>
                      <Typography className='pds-update-old'>{familyUpdates.father_extn.old_value}</Typography>
                      <Typography className='pds-update-new'>{familyUpdates.father_extn.new_value}</Typography>
                      <Box display='flex' justifyContent='space-between'>
                        <Button size="small" variant='contained' className='pds-update-btn' onClick={() => updateFamilyInfo(familyUpdates.father_extn, familyUpdates, setFamilyUpdates)}>Approve</Button>
                        <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(familyUpdates.father_extn, familyUpdates, setFamilyUpdates)}>Decline</Button>
                      </Box>
                    </>) : (
                      <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table aria-label="simple table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ color: 'primary.main' }} colSpan={4}>Mother's Information</TableCell>
                </TableRow>
                <TableRow className='pds-update-table-row'>
                  <TableCell align="center" className='pds-update-table-row-color' width="25%">Last Name</TableCell>
                  <TableCell align="center" className='pds-update-table-row-color' width="25%">First Name</TableCell>
                  <TableCell align="center" className='pds-update-table-row-color' width="25%">Middle Name</TableCell>
                  <TableCell align="center" className='pds-update-table-row-color' width="25%">Maiden Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" sx={{ verticalAlign: 'top' }}>
                    {familyUpdates.mother_lname ? (<>
                      <Typography className='pds-update-old'>{familyUpdates.mother_lname.old_value}</Typography>
                      <Typography className='pds-update-new'>{familyUpdates.mother_lname.new_value}</Typography>
                      <Box display='flex' justifyContent='space-between'>
                        <Button variant='contained' size="small" className='pds-update-btn' onClick={() => updateFamilyInfo(familyUpdates.mother_lname, familyUpdates, setFamilyUpdates)}>Approve</Button>
                        <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(familyUpdates.mother_lname, familyUpdates, setFamilyUpdates)}>Decline</Button>
                      </Box>
                    </>) : (
                      <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ verticalAlign: 'top' }}>
                    {familyUpdates.mother_fname ? (<>
                      <Typography className='pds-update-old'>{familyUpdates.mother_fname.old_value}</Typography>
                      <Typography className='pds-update-new'>{familyUpdates.mother_fname.new_value}</Typography>
                      <Box display='flex' justifyContent='space-between'>
                        <Button variant='contained' size="small" className='pds-update-btn' onClick={() => updateFamilyInfo(familyUpdates.mother_fname, familyUpdates, setFamilyUpdates)}>Approve</Button>
                        <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(familyUpdates.mother_fname, familyUpdates, setFamilyUpdates)}>Decline</Button>
                      </Box>
                    </>) : (
                      <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ verticalAlign: 'top' }}>
                    {familyUpdates.mother_mname ? (<>
                      <Typography className='pds-update-old'>{familyUpdates.mother_mname.old_value}</Typography>
                      <Typography className='pds-update-new'>{familyUpdates.mother_mname.new_value}</Typography>
                      <Box display='flex' justifyContent='space-between'>
                        <Button variant='contained' size="small" className='pds-update-btn' onClick={() => updateFamilyInfo(familyUpdates.mother_mname, familyUpdates, setFamilyUpdates)}>Approve</Button>
                        <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(familyUpdates.mother_mname, familyUpdates, setFamilyUpdates)}>Decline</Button>
                      </Box>
                    </>) : (
                      <Typography className='pds-update-noupdate' align="center">No Update</Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ verticalAlign: 'top' }}>
                    {familyUpdates.mother_maiden ? (<>
                      <Typography className='pds-update-old'>{familyUpdates.mother_maiden.old_value}</Typography>
                      <Typography className='pds-update-new'>{familyUpdates.mother_maiden.new_value}</Typography>
                      <Box display='flex' justifyContent='space-between'>
                        <Button variant='contained' size="small" className='pds-update-btn' onClick={() => updateFamilyInfo(familyUpdates.mother_maiden, familyUpdates, setFamilyUpdates)}>Approve</Button>
                        <Button variant='contained' color="error" size="small" className='pds-update-btn' onClick={() => handleOpenModal(familyUpdates.mother_maiden, familyUpdates, setFamilyUpdates)}>Decline</Button>
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

export default Family