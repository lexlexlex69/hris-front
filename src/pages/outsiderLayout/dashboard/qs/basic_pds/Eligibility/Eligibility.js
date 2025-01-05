import React, { useEffect, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'
import Pagination from '@mui/material/Pagination';
import Tooltip from '@mui/material/Tooltip';

import AddIcon from '@mui/icons-material/Add'
import AttachmentIcon from '@mui/icons-material/Attachment'

import CustomDialog from '../CustomDialog';
import Add from './Add';
import Update from './Update'

import { getEligibility } from './Controller';
import { handleDelete } from '../Common';
import Skeleton from '@mui/material/Skeleton'

import { handleViewFile } from '../CustomFunctions';
import { PdsContext } from '../../../applicantPds/MyContext';
import PdsBtn from '../../../PdsBtn';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


import moment from 'moment';

const Eligibility = () => {
    const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const { contextId, handleContextId, applicantStatusContext } = useContext(PdsContext) || ''
    const [openAdd, setOpenAdd] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [editState, setEditState] = useState(false)
    const [eligibility, setEligibility] = useState([])
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [loader, setLoader] = useState(true)
    const handleOpenAdd = () => setOpenAdd(true)
    const handleCloseAdd = () => setOpenAdd(false)

    const handleOpenEdit = (item) => {
        setEditState(item)
        setOpenEdit(true)
    }
    const handleCloseEdit = () => setOpenEdit(false)

    const handlePaginate = (e, v) => {
        let controller = new AbortController()
        setLoader(true)
        getEligibility(setEligibility, controller, setLoader, v, setTotal, parseInt(localStorage.getItem('applicant_temp_id')) ? parseInt(localStorage.getItem('applicant_temp_id')) : contextId ? contextId : '')
        setPage(v)
    }

    useEffect(() => {
        let controller = new AbortController()
        getEligibility(setEligibility, controller, setLoader, page, setTotal, parseInt(localStorage.getItem('applicant_temp_id')) ? parseInt(localStorage.getItem('applicant_temp_id')) : contextId ? contextId : '')
        return () => controller.abort()
    }, [])
    return (
        <Box sx={{ px: { xs: 1, md: 15, lg: 15 } }}>
            {!matches && 
             <Box sx={{ display: 'flex' }}>
             <Typography variant="body1" color="initial" sx={{ p: .5, bgcolor: 'primary.light', color: '#fff', borderRadius: '.2rem' }}>Eligibility</Typography>
         </Box>
            }
           
            <CustomDialog open={openAdd} handleClose={handleCloseAdd} >
                <Add eligibility={eligibility || []} setEligibility={setEligibility} handleClose={handleCloseAdd} total={total} setTotal={setTotal} />
            </CustomDialog>
            <CustomDialog open={openEdit} handleClose={handleCloseEdit} forUpdate >
                <Update eligibility={eligibility || []} setEligibility={setEligibility} handleClose={handleCloseEdit} total={total} setTotal={setTotal} item={editState} />
            </CustomDialog>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" disabled={!contextId && !localStorage.getItem('applicant_temp_id') && applicantStatusContext === 3 ? true : false} color="primary" startIcon={<AddIcon />} sx={{ borderRadius: '2rem', mb: 1 }} onClick={handleOpenAdd}>
                    Add
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table size='small' aria-label="education table" className='cgb-color-table'>
                    <TableHead>
                        <TableRow>
                            <TableCell rowSpan={2}><Typography className='table-font-size'>Actions</Typography> </TableCell>
                            <TableCell rowSpan={2} align="center"><Typography className='table-font-size'>CAREER SERVICE/RA 1080 (BOARD/BAR/) UNDER SPECIAL LAW/CES/CSEE BARANGAY ELIGIBILITY/DRIVER'S LICENSE</Typography></TableCell>
                            <TableCell rowSpan={2} align="center"><Typography className='table-font-size' >RATING
                                (if applicable)</Typography> </TableCell>
                            <TableCell rowSpan={2} align="center"><Typography className='table-font-size'>DATE of EXAMINATION / CONFERMENT</Typography></TableCell>
                            <TableCell rowSpan={2} align="center"><Typography className='table-font-size'>PLACE OF EXAMINATION</Typography> </TableCell>
                            <TableCell colSpan={2} align="center">
                                <Typography className='table-font-size'>
                                    LICENSE (if applicable)
                                </Typography>
                            </TableCell>
                            <TableCell rowSpan={2} align="center"><Typography className='table-font-size'>Attached file</Typography></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left"><Typography className='table-font-size'>Number</Typography></TableCell>
                            <TableCell align="left"><Typography className='table-font-size'>Date of Validity</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loader ? (
                            <>
                                {Array.from(Array(5)).map((item, i) => (
                                    <TableRow sx={{ bgcolor: '#fff' }}>
                                        <TableCell sx={{ display: 'flex', gap: 1 }}>
                                            <Skeleton variant="text" width="" height={25} sx={{ flex: 1 }} />
                                            <Skeleton variant="text" width="" height={25} sx={{ flex: 1 }} />
                                        </TableCell>
                                        <TableCell align="center"><Skeleton variant="text" width="" height={25} /></TableCell>
                                        <TableCell align="center"><Skeleton variant="text" width="" height={25} /></TableCell>
                                        <TableCell align="center"><Skeleton variant="text" width="" height={25} /></TableCell>
                                        <TableCell align="center"><Skeleton variant="text" width="" height={25} /></TableCell>
                                        <TableCell align="center"><Skeleton variant="text" width="" height={25} /></TableCell>
                                        <TableCell align="center"><Skeleton variant="text" width="" height={25} /></TableCell>
                                        <TableCell align="center"><Skeleton variant="text" width="" height={25} /></TableCell>
                                    </TableRow>
                                ))}
                            </>
                        ) : (
                            <>
                                {eligibility && eligibility.map((item, i) => (
                                    <TableRow key={item.id} sx={{ bgcolor: '#fff' }}>
                                        <TableCell>
                                            <Box display='flex' gap={1}>
                                                <PdsBtn type='update' onClick={() => handleOpenEdit(item)} />
                                                <PdsBtn type='delete' onClick={() => handleDelete(item.id, 'hris_applicant_eligibility', eligibility, setEligibility)} />
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">{item.title}</TableCell>
                                        <TableCell align="center">{item.rating}</TableCell>
                                        <TableCell align="center">{moment(item.dateofexam, "YYYY-MM-DD").format("MM/DD/YYYY")}</TableCell>
                                        <TableCell align="center">{item.placeofexam}</TableCell>
                                        <TableCell>{item.licenseno}</TableCell>
                                        <TableCell>{moment(item.dateissue, "YYYY-MM-DD").format("MM/DD/YYYY") === 'Invalid date' ? item.dateissue?.toUpperCase() : moment(item.dateissue, "YYYY-MM-DD").format("MM/DD/YYYY")}</TableCell>
                                        <TableCell align="center">
                                            {item.file_path ? (
                                                <Tooltip title="view attachment">
                                                    <AttachmentIcon color='primary' fontSize='large' onClick={() => handleViewFile(item.id, 'applicant/pds/Eligibility/handleViewFile')} />
                                                </Tooltip>
                                            ) : (
                                                <Typography sx={{ bgcolor: 'error.main', p: .5, borderRadius: '.2rem', color: '#fff' }}>no file</Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {!loader &&
                <Box sx={{ display: 'flex', mt: .5 }}>
                    {eligibility.length === 0 && <Typography sx={{ p: .5, bgcolor: 'error.main', color: '#fff', borderRadius: '.2rem' }}>No record found!</Typography>}
                </Box>
            }
            <Pagination page={page} count={Math.ceil(total / 5)} sx={{ mt: 1 }} color='primary' onChange={handlePaginate} />
        </Box>
    );
};

export default Eligibility;