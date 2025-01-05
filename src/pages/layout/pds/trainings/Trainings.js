import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { blue, green, red, yellow } from '@mui/material/colors'
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// mui components
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fab from '@mui/material/Fab';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
// mui icons components
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ErrorIcon from '@mui/icons-material/Error';
import CachedIcon from '@mui/icons-material/Cached';
import SendAndArchiveIcon from '@mui/icons-material/SendAndArchive';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import ReloadTable from '../../../../assets/img/reloadingtable.svg'

import Swal from 'sweetalert2'
// redux
import { useDispatch, useSelector } from 'react-redux'
import { getPdsTrainings } from '../../../../redux/slice/pdsTrainings'

// external imports
import SkeletonLoader from '../customComponents/SkeletonLoader';
import Add from './Add'
import Update from './Update'
import TableUpdates from './TableUpdates'
// external import functions
import { getEmployeeTrainings, handleDeleteLocal, handleUpdate, handleUndo, getTrainingsUpdates } from './Controller';
// external import global functions for pds only
import CustomRemove from '../customComponents/CustomRemove';
import CustomDeleteIcon from '../customComponents/CustomDeleteIcon';
import CustomEditIcon from '../customComponents/CustomEditIcon';
import Warning from '../customComponents/Warning';
import moment from 'moment';
import { handlePaginationChangeFunction, handleViewFile, handleViewToAddFile } from '../customFunctions/CustomFunctions'


function Trainings() {
  // use params
  const pdsParam = useParams()
  // loader
  const [loader, setLoader] = useState(false)
  // redux
  // const dispatch = useDispatch()
  // const { trainings } = useSelector(state => state.trainings)
  const [trainings, setTrainings] = useState([])
  const [trainingsUpdates, setTrainingsUpdates] = useState([])
  const [trainingsRecord, setTrainingsRecord] = useState([])
  const [defaultState, setDefaultState] = useState([])
  // media query
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  // modal states adding work experience
  const [openAddModal, setOpenAddModal] = useState(false);
  const handleOpenAddModal = () => setOpenAddModal(true)
  const handleCloseAddModal = () => setOpenAddModal(false);

  // modal states update children
  const firstRender = useRef(true)
  const [updateRecordState, setUpdateRecordState] = useState('')
  const [updateRecordTrigger, setUpdateRecordTrigger] = useState(false)
  const [openUpdateRecord, setOpenUpdateRecord] = useState(false);
  const handleOpenUpdateRecordModal = (data) => {
    setUpdateRecordState(data)
    setUpdateRecordTrigger(true)
  }
  const handleCloseUpdateRecordModal = () => {
    setUpdateRecordTrigger(false)
    setOpenUpdateRecord(false)
  };

  //  modal state table updates
  const [openTableModal, setOpenTableModal] = useState(false);
  const hOpenTableModal = () => setOpenTableModal(true)
  const hCloseTableModal = () => setOpenTableModal(false);

  // pagination
  const [tableData, setTableData] = useState([])
  const [pageTotal, setPageTotal] = useState(0)
  const [perPage, setPerPage] = useState(5)
  const [page, setPage] = useState(1)
  const handleChange = (event, value) => {
    // if (page !== value)
      handlePaginationChangeFunction(value, setPage, trainings, setTrainings, setTableData, perPage)
  };

  // reload table

  const handleReloadTable = () => {
    Swal.fire({
      text: 'reloading the table . . .',
      icon: 'info',
      allowOutsideClick: false,
    })
    Swal.showLoading()
    setTrainingsRecord([])
    let controller = new AbortController()
    getTrainingsUpdates(pdsParam.id, setTrainings, controller, setPageTotal, perPage, setTableData, setTrainingsUpdates, setDefaultState, setLoader)
  }

  useEffect(() => {
    let controller = new AbortController()
    if (pdsParam.id && localStorage.getItem('hris_roles') === '1') {
      getTrainingsUpdates(pdsParam.id, setTrainings, controller, setPageTotal, perPage, setTableData, setTrainingsUpdates, setDefaultState, setLoader)
    }
    else {
      getTrainingsUpdates('', setTrainings, controller, setPageTotal, perPage, setTableData, setTrainingsUpdates, setDefaultState, setLoader)
    }

    // clean up
    return () => {
      controller.abort()
    }
  }, [])

  // when update button is click
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
    }
    else {
      if (updateRecordTrigger) {
        setOpenUpdateRecord(true)
      }
    }
  }, [updateRecordTrigger])

  return (
    <Grid container sx={{ px: matches ? 0 : 20 }}>
      <Modal
        aria-labelledby="transition-modal-add-record"
        aria-describedby="transition-modal-add-record"
        open={openAddModal}
        sx={{ zIndex: 1000 }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
        }}
      >
        <Fade in={openAddModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: matches ? '90%' : '50%',
            bgcolor: 'background.paper',
            height:'80%',
            borderRadius: '1rem',
            boxShadow: 24,
            p: 2,
            pt: 1
          }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>NEW TRAINING RECORD</Typography></Box>
            <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
              <Tooltip title="close modal">
                <HighlightOffIcon fontSize='large' onClick={handleCloseAddModal} sx={{ cursor: 'pointer', color: red[200] }} />
              </Tooltip>
            </Box>
            <Add handleClose={handleCloseAddModal} trainings={trainings} setTrainings={setTrainings} trainingsRecord={trainingsRecord} setTrainingsRecord={setTrainingsRecord} page={page} setPageTotal={setPageTotal} tableData={tableData} setTableData={setTableData} perPage={perPage} />
          </Box>
        </Fade>
      </Modal>
      {/*  */}
      {/* Update Record */}
      <Modal
        aria-labelledby="transition-modal-add-child"
        aria-describedby="transition-modal-add-child"
        open={openUpdateRecord}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
        }}
        sx={{ zIndex: 999 }}
      >
        <Fade in={openUpdateRecord}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: matches ? '90%' : '80%',
            height:'70%',
            bgcolor: 'background.paper',
            borderRadius: '1rem',
            boxShadow: 24,
            p: 2,
          }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>UPDATE TRAINING</Typography></Box>
            <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
              <Tooltip title="close modal">
                <HighlightOffIcon fontSize='large' onClick={handleCloseUpdateRecordModal} sx={{ cursor: 'pointer', color: red[200] }} />
              </Tooltip>
            </Box>
            <Update data={updateRecordState} handleClose={handleCloseUpdateRecordModal} trainings={trainings} setTrainings={setTrainings} trainingsRecord={trainingsRecord} setTrainingsRecord={setTrainingsRecord} tableData={tableData} setTableData={setTableData} />
          </Box>
        </Fade>
      </Modal>
      {/*  */}
      {/*  */}
      <Modal
        sx={{ zIndex: 999 }}
        aria-labelledby="transition-modal-add-child"
        aria-describedby="transition-modal-add-child"
        open={openTableModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openTableModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            height: '80%',
            transform: 'translate(-50%, -50%)',
            width: matches ? '80%' : '95%',
            // bgcolor: 'background.paper',
            bgcolor: 'background.paper',
            borderRadius: '1rem',
            boxShadow: 24,
            px: 2,
            pt: 1,
            pb: 4,
          }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>{!pdsParam.id && localStorage.getItem('hris_roles') !== '1' && trainingsUpdates.length > 0 ? 'PENDING UPDATES' : 'CHECK TABLE UPDATES'}</Typography></Box>
            <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
              <Tooltip title="close modal">
                <HighlightOffIcon fontSize='large' onClick={hCloseTableModal} sx={{ cursor: 'pointer', color: red[200] }} />
              </Tooltip>
            </Box>
            <TableUpdates handleClose={hCloseTableModal} trainings={trainings} setTrainings={setTrainings} trainingsUpdates={trainingsUpdates ? trainingsUpdates : []} setTrainingsUpdates={setTrainingsUpdates} pdsParam={pdsParam || ''} />
            {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', position: 'absolute', bottom: 10, right: 10 }}>
              <Button variant='contained' color="error" size="small" sx={{ mt: 1 }} onClick={hCloseTableModal}>
                close
              </Button>
            </Box> */}
          </Box>
        </Fade>
      </Modal>
      <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: 'flex', gap: 1, flexDirection: 'column', bgcolor: '#fff', borderRadius: '.5rem' }} >
        {!loader ? (
          <SkeletonLoader />
        ) : (
          <Fade in >
            <div>
          {!matches && <Typography variant="body2" color="#fff" sx={{bgcolor:'primary.main',p:.5,px:1,borderRadius:.5}}>LEARNING AND DEVELOPMENT (L&D) INTERVENTIONS/TRAINING PROGRAM ATTENDED</Typography>}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, mt: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <Tooltip title="reload table">
                    <CachedIcon fontSize='large' className='reloader-icons' onClick={handleReloadTable} />
                  </Tooltip>
                </Box>
                {pdsParam.id && localStorage.getItem('hris_roles') === '1' ? (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }} className="side-add-button">
                    {pdsParam.id && localStorage.getItem('hris_roles') === '1' && trainingsUpdates.length > 0 ? (
                      <Button variant="contained" className='pending-updates-btn' onClick={hOpenTableModal} color="warning" startIcon={<ErrorIcon fontSize='large' className="pulsive-button" />}>
                        {matches ? 'UPDATES' : (<b>check available table updates</b>)}
                      </Button>
                    ) : null}
                  </Box>
                ) : null}
                {!pdsParam.id && trainingsUpdates.length > 0 ? (
                  <Box>
                    <Button variant="contained" className='pending-updates-btn' color="warning" onClick={hOpenTableModal} startIcon={<ErrorIcon fontSize='large' className="pulsive-button" />} >
                      {matches ? 'PENDING' : (<b>pending updates</b>)}
                    </Button>
                  </Box>
                ) : null}
                {pdsParam.id && localStorage.getItem('hris_roles') === '1' ? null : (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }} className="side-add-button">
                    <Tooltip title="add new record" placement="top">
                      <Button variant='contained' className='add-record-btn' color="primary" onClick={handleOpenAddModal}><AddIcon />add</Button>
                    </Tooltip>
                  </Box>
                )}
              </Box>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
                  <TableHead sx={{ bgcolor: blue[800] }}>
                    <TableRow>
                      {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                        <TableCell className='cgb-color-table' align="center"><Typography className='table-font-size' sx={{ color: '#fff' }}></Typography></TableCell>
                      )}
                      <TableCell className='cgb-color-table' align="center"><Typography className='table-font-size' sx={{ color: '#fff' }}>TITLE OF LEARNING AND DEVELOPMENT INTERVENTIONS/TRAINING PROGRAMS <br /> (write in full)</Typography></TableCell>
                      <TableCell className='cgb-color-table' align="center"><Typography className='table-font-size' sx={{ color: '#fff' }}>INCLUSIVE DATES OF ATTENDANCE <br /> (mm/dd/yyyy)</Typography>
                        <Table size="small">
                          <TableBody>
                            <TableRow>
                              <TableCell className='cgb-color-table'><Typography className='table-font-size' sx={{ color: '#fff' }}>From</Typography></TableCell>
                              <TableCell className='cgb-color-table'><Typography className='table-font-size' sx={{ color: '#fff' }}>To</Typography></TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableCell>
                      <TableCell className='cgb-color-table' align="center"><Typography className='table-font-size' sx={{ color: '#fff' }}>NUMBER OF HOURS</Typography></TableCell>
                      <TableCell className='cgb-color-table' align="center"><Typography className='table-font-size' sx={{ color: '#fff' }}>Type of LD <br />Managerial/Supervisory/Technical/etc</Typography></TableCell>
                      <TableCell className='cgb-color-table' align="center"><Typography className='table-font-size' sx={{ color: '#fff' }}>CONDUCTED/SPONSORED BY <br /> (write in full)</Typography></TableCell>
                      <TableCell className='cgb-color-table' align="center"><Typography className='table-font-size' sx={{ color: '#fff' }}>ATTACHED FILE</Typography></TableCell>

                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData && tableData.map((item, index) => (
                      <Fade in key={index}>
                        <TableRow
                          sx={{ '&:last-child td, &:last-child th': { border: 0 }, bgcolor: item.isNew ? blue[300] : item.isDelete ? red[300] : item.isUpdated ? yellow[500] : null }}
                        >
                          {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                            <TableCell sx={{ bgcolor: '#fff' }}>
                              {item.isNew || item.isDelete || item.isUpdated ? (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                  <CustomRemove color={item.isNew ? blue[700] : item.isDelete ? red[700] : item.isUpdated ? yellow[700] : null} onClick={() => handleUndo(item, trainings, setTrainings, trainingsRecord, setTrainingsRecord, tableData, setTableData, defaultState,setPageTotal)} />
                                </Box>
                              ) : (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Tooltip title="Edit record">
                                    <CustomEditIcon onClick={() => handleOpenUpdateRecordModal(item)} />
                                  </Tooltip>
                                  <Tooltip title="Delete record">
                                    <CustomDeleteIcon onClick={() => handleDeleteLocal(item, index, trainingsRecord, setTrainingsRecord, trainings, setTrainings, tableData, setTableData)} />
                                  </Tooltip>
                                </Box>
                              )}
                            </TableCell>
                          )}
                          <TableCell className='table-font-size' component="th" scope="row" align="left" sx={{ color: '#5c5c5c' }}>
                            <b>{item.title}</b>
                          </TableCell>
                          <TableCell className='table-font-size' align="center">
                            <Table>
                              <TableBody>
                                <TableRow>

                                  <TableCell className='table-font-size' sx={{ color: '#5c5c5c' }}>
                                    <b>{moment(item.datefrom).format('MM/DD/YYYY')}</b>
                                  </TableCell>
                                  <TableCell className='table-font-size' sx={{ color: '#5c5c5c' }}>
                                    <b>{moment(item.dateto).format('MM/DD/YYYY')}</b>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableCell>
                          <TableCell align="center" className='table-font-size' sx={{ color: '#5c5c5c' }}><b>{item.nohours}</b></TableCell>
                          <TableCell align="center" className='table-font-size' sx={{ color: '#5c5c5c' }}><b>{item.typeLD}</b></TableCell>
                          <TableCell align="center" className='table-font-size' sx={{ color: '#5c5c5c' }}><b>{item.conducted}</b></TableCell>
                          <TableCell align="center" className='table-font-size' sx={{ color: '#5c5c5c' }}>
                            {item.file_path ? (
                              <>
                                {item.isNew ? (
                                  <Tooltip title="view attached file">
                                    <AttachFileIcon onClick={() => handleViewToAddFile(item.file_path)} sx={{ color: blue[600], cursor: 'pointer', '&:hover': { color: blue[800] }, transform: 'rotate(30DEG)' }} />
                                  </Tooltip>
                                ) : (
                                  <Tooltip title="view attached file">
                                    <AttachFileIcon onClick={() => item.isUpdated ?  handleViewToAddFile(item.file_path) : handleViewFile(item.id, 'trainings/viewAttachFile')} sx={{ color: blue[600], cursor: 'pointer', '&:hover': { color: blue[800] }, transform: 'rotate(30DEG)' }} />
                                  </Tooltip>
                                )}

                              </>

                            ) : (
                              <Typography sx={{ color: '#fff', bgcolor: red[500], textAlign: 'center', borderRadius: '.2rem' }}>no file</Typography>
                            )}
                          </TableCell>

                        </TableRow>
                      </Fade>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <Pagination count={Math.ceil(pageTotal / perPage)} page={page} variant="outlined" onChange={handleChange} color="primary" />
              </Stack>
              {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                <Box className="side-add-button">
                  <Button variant="contained" sx={{ color: '#fff', borderRadius: '2rem' }} color="success" onClick={() => handleUpdate(pdsParam.id ? pdsParam.id : localStorage.getItem('hris_employee_id'), trainingsRecord, setTrainingsRecord, setTrainings, defaultState, setTableData, perPage, setPage,setPageTotal)}> Submit update</Button>
                </Box>
              )}

            </div>
          </Fade>
        )}
      </Grid>
    </Grid>
  )
}

export default Trainings