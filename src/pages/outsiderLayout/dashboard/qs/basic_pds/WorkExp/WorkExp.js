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
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import CustomDialog from '../CustomDialog';
import Add from './Add';
import Update from './Update';
import AttachmentIcon from '@mui/icons-material/Attachment';

import { getWorkExp } from './Controller';
import { handleDelete } from '../Common';
import Skeleton from '@mui/material/Skeleton'

import { handleViewFile, handleViewFileTest } from '../CustomFunctions';
import { PdsContext } from '../../../applicantPds/MyContext';

import PdsBtn from '../../../PdsBtn';

import moment from 'moment';

const WorkExp = () => {
    const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const { contextId, handleContextId, applicantStatusContext } = useContext(PdsContext) || ''
    const [openAdd, setOpenAdd] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [editState, setEditState] = useState('')
    const [workExp, setWorkExp] = useState([])
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
        getWorkExp(setWorkExp, controller, setLoader, v, setTotal, parseInt(localStorage.getItem('applicant_temp_id')) ? parseInt(localStorage.getItem('applicant_temp_id')) : contextId ? contextId : '')
        setPage(v)
    }

    useEffect(() => {
        let controller = new AbortController()
        getWorkExp(setWorkExp, controller, setLoader, page, setTotal, parseInt(localStorage.getItem('applicant_temp_id')) ? parseInt(localStorage.getItem('applicant_temp_id')) : contextId ? contextId : '')
        return () => controller.abort()
    }, [])
    return (
        <Box sx={{ px: { xs: 1, md: 15, lg: 15 } }}>
            {!matches && 
              <Box sx={{ display: 'flex' }}>
              <Typography variant="body1" color="initial" sx={{ p: .5, bgcolor: 'primary.light', color: '#fff', borderRadius: '.2rem' }}>Work Experience</Typography>
          </Box>
           }
         
            <CustomDialog open={openAdd} handleClose={handleCloseAdd} >
                <Add trainings={workExp} setTrainings={setWorkExp} handleClose={handleCloseAdd} total={total} setTotal={setTotal} />
            </CustomDialog>
            <CustomDialog open={openEdit} handleClose={handleCloseEdit} forUpdate >
                <Update trainings={workExp} setTrainings={setWorkExp} handleClose={handleCloseEdit} total={total} setTotal={setTotal} item={editState} />
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
                            <TableCell align="center" colSpan={2}><Typography className='table-font-size'>INCLUSIVE DATES <br />
                                (mm/dd/yyyy)</Typography></TableCell>
                            <TableCell rowSpan={2} align="center"><Typography className='table-font-size' >POSITION TITLE
                                (Write in full/Do not abbreviate)</Typography> </TableCell>
                            <TableCell rowSpan={2} align="center"><Typography className='table-font-size'>DEPARTMENT/AGENCY/OFFICE/COMPANY
                                (Write in full/Do not abbreviate)</Typography></TableCell>
                            <TableCell rowSpan={2} align="center"><Typography className='table-font-size'>MONTHLY SALARY</Typography> </TableCell>
                            <TableCell rowSpan={2} align="center"><Typography className='table-font-size'>SALARY/JOB/PAY GRADE(if applicable) & STEP (Formal*00-0)/INCREMENT</Typography> </TableCell>
                            <TableCell rowSpan={2} align="center"><Typography className='table-font-size'>STATUS OF APPOINTMENT</Typography> </TableCell>
                            <TableCell rowSpan={2} align="center"><Typography className='table-font-size'>GOV'T SERVICE(Y/N)</Typography> </TableCell>
                            <TableCell rowSpan={2} align="center"><Typography className='table-font-size'>Attached file</Typography></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left"><Typography className='table-font-size'>FROM</Typography></TableCell>
                            <TableCell align="left"><Typography className='table-font-size'>TO</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loader ? (
                            <>
                                {Array.from(Array(5)).map((item, i) => (
                                    <TableRow key={i} sx={{ bgcolor: '#fff' }}>
                                        <Skeleton variant="text" width="" height={25} sx={{ flex: 1 }} />
                                        <Skeleton variant="text" width="" height={25} sx={{ flex: 1 }} />
                                        <TableCell align="center"><Skeleton variant="text" width="" height={25} /></TableCell>
                                        <TableCell align="center"><Skeleton variant="text" width="" height={25} /></TableCell>
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
                                {workExp && workExp.map((item, i) => (
                                    <TableRow key={item.id} sx={{ bgcolor: '#fff' }}>
                                        <TableCell >
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <PdsBtn type='update' onClick={() => handleOpenEdit(item)} />
                                                <PdsBtn type='delete' onClick={() => handleDelete(item.id, 'hris_applicant_employment', workExp, setWorkExp)} />
                                            </Box>
                                        </TableCell>
                                        <TableCell>{moment(item.datefrom, "YYYY-MM-DD").format("MM/DD/YYYY")}</TableCell>
                                        <TableCell>{moment(item?.dateto, "YYYY-MM-DD").format("MM/DD/YYYY") === 'Invalid date' ? item?.dateto?.toUpperCase() : moment(item?.dateto, "YYYY-MM-DD").format("MM/DD/YYYY")}</TableCell>
                                        <TableCell align="center">{item.positiontitle}</TableCell>
                                        <TableCell align="center">{item.agency}</TableCell>
                                        <TableCell align="center">{item.salary}</TableCell>
                                        <TableCell align="center">{item.salgrade}</TableCell>
                                        <TableCell align="center">{item?.status === 'RE' ? 'PERMANENT' : item?.status === 'TE' ? 'TEMPORARY' : item?.status === 'PA' ? 'PRESIDENTIAL APPOINTEE' : item?.status === 'CT' ? 'CO-TERMINOS' : item?.status === 'CN' ? 'CONTRACTUAL' : item?.status === 'CS' ? 'CASUAL' : item?.status === 'JO' ? 'JOB ORDER' : item?.status === 'CO' ? 'CONSULTANT' : item?.status === 'COS' ? 'CONTRACT OF SERVICE' : item?.status === 'EL' ? 'ELECTIVE' : item?.status === 'HN' ? 'HONORARIUM' : ''}</TableCell>
                                        <TableCell align="center">{item?.govt === 1 ? 'YES' : 'NO'}</TableCell>
                                        <TableCell align="center">
                                            {item.file_path ? (
                                                <Tooltip title="view attachment">
                                                    <AttachmentIcon color='primary' fontSize='large' onClick={() => handleViewFile(item.id, 'applicant/pds/WorkExp/handleViewFile')} />
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
                    {workExp.length === 0 && <Typography sx={{ p: .5, bgcolor: 'error.main', color: '#fff', borderRadius: '.2rem' }}>No record found!</Typography>}
                </Box>
            }
            <Pagination page={page} count={Math.ceil(total / 5)} sx={{ mt: 1 }} color='primary' onChange={handlePaginate} />
        </Box>
    );
};

export default WorkExp;