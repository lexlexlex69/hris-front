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
import Tooltip from '@mui/material/Tooltip'

import AddIcon from '@mui/icons-material/Add'
import AttachmentIcon from '@mui/icons-material/Attachment';

import CustomDialog from '../CustomDialog';
import Add from './Add';
import Update from './Update';

import { getTrainings } from './Controller';
import Skeleton from '@mui/material/Skeleton'

import { handleViewFile } from '../CustomFunctions';
import { PdsContext } from '../../../applicantPds/MyContext';
import { handleDelete } from '../Common';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import PdsBtn from '../../../PdsBtn';
import moment from 'moment';

const Trainings = () => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const { contextId, handleContextId, applicantStatusContext } = useContext(PdsContext) || ''
    const [openAdd, setOpenAdd] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [editState, setEditState] = useState('')
    const [trainings, setTrainings] = useState([])
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

    const handlePaginate = (event, value) => {
        let controller = new AbortController()
        setLoader(true)
        getTrainings(setTrainings, controller, setLoader, value, setTotal, parseInt(localStorage.getItem('applicant_temp_id')) ? parseInt(localStorage.getItem('applicant_temp_id')) : contextId ? contextId : '')
        setPage(value)
    }

    useEffect(() => {
        let controller = new AbortController()
        getTrainings(setTrainings, controller, setLoader, page, setTotal, parseInt(localStorage.getItem('applicant_temp_id')) ? parseInt(localStorage.getItem('applicant_temp_id')) : contextId ? contextId : '')
        return () => controller.abort()
    }, [])
    return (
        <Box sx={{ px: { xs: 1, md: 15, lg: 15 } }}>
            {!matches && 
                <Box sx={{ display: 'flex' }}>
                    <Typography variant="body1" color="initial" sx={{ p: .5, bgcolor: 'primary.light', color: '#fff', borderRadius: '.2rem' }}>Learning and development (L&D) interventions/training program attended learning and development</Typography>
                </Box>
            }
            <CustomDialog open={openAdd} handleClose={handleCloseAdd} >
                <Add trainings={trainings} setTrainings={setTrainings} handleClose={handleCloseAdd} total={total} setTotal={setTotal} />
            </CustomDialog>
            <CustomDialog open={openEdit} handleClose={handleCloseEdit} forUpdate >
                <Update trainings={trainings} setTrainings={setTrainings} handleClose={handleCloseEdit} total={total} setTotal={setTotal} item={editState} />
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
                            <TableCell rowSpan={2} align="center"><Typography className='table-font-size'>TITLE OF LEARNING AND DEVELOPMENT INTERVENTIONS/TRAINING PROGRAMS
                                (write in full)</Typography></TableCell>
                            <TableCell colSpan={2} align="center">
                                <Typography className='table-font-size'>
                                    INCLUSIVE DATES OF ATTENDANCE
                                    (mm/dd/yyyy)
                                </Typography>
                                <Table size='small' aria-label="period attendance table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell></TableCell>
                                            <TableCell align="left"><Typography className='table-font-size'>FROM</Typography></TableCell>
                                            <TableCell align="left"><Typography className='table-font-size'>TO</Typography></TableCell>
                                        </TableRow>
                                    </TableHead>
                                </Table>
                            </TableCell>
                            <TableCell rowSpan={2} align="center"><Typography className='table-font-size' >NUMBER OF HOURS</Typography> </TableCell>
                            <TableCell rowSpan={2} align="center"><Typography className='table-font-size'>TYPE OF LD Managerial/Supervisory/Technical/etc</Typography></TableCell>
                            <TableCell rowSpan={2} align="center"><Typography className='table-font-size'>CONDUCTED/SPONSORED (write in full)</Typography> </TableCell>

                            <TableCell rowSpan={2} align="center"><Typography className='table-font-size'>Attached file</Typography></TableCell>
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
                                {trainings && trainings.map((item, i) => (
                                    <TableRow key={item.id} sx={{ bgcolor: '#fff' }}>
                                        <TableCell >
                                            <Box display='flex' gap={1}>
                                                <PdsBtn type='update' onClick={() => handleOpenEdit(item)} />
                                                <PdsBtn type='delete' onClick={() => handleDelete(item.id, 'hris_applicant_training', trainings, setTrainings)} />
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center" className='table-font-size'>{item.title}</TableCell>
                                        <TableCell className='table-font-size' align="center">{moment(item.datefrom, "YYYY-MM-DD").format("MM/DD/YYYY")}</TableCell>
                                        <TableCell className='table-font-size' align="center">{moment(item.dateto, "YYYY-MM-DD").format("MM/DD/YYYY")}</TableCell>
                                        <TableCell align="center" className='table-font-size'>{item.nohours}</TableCell>
                                        <TableCell className='table-font-size'>{item.typeLD}</TableCell>
                                        <TableCell className='table-font-size'>{item.conducted}</TableCell>
                                        <TableCell align="center" >
                                            {item.file_path ? (
                                                <Tooltip title="view attachment">
                                                    <AttachmentIcon color='primary' fontSize='large' onClick={() => handleViewFile(item.id, 'applicant/pds/Trainings/handleViewFile')} />
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
                    {trainings.length === 0 && <Typography sx={{ p: .5, bgcolor: 'error.main', color: '#fff', borderRadius: '.2rem' }}>No record found!</Typography>}
                </Box>
            }
            <Pagination page={page} count={Math.ceil(total / 5)} sx={{ mt: 1 }} color='primary' onChange={handlePaginate} />
        </Box>
    );
};

export default Trainings;