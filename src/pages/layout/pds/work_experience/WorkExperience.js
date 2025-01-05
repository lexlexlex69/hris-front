import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { blue, green, red, yellow } from '@mui/material/colors'
import { useParams } from 'react-router-dom';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// mui components
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Swal from 'sweetalert2';
// mui icons components
import AddIcon from '@mui/icons-material/Add';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ErrorIcon from '@mui/icons-material/Error';
import CachedIcon from '@mui/icons-material/Cached';
import HighlightOffIcon from '@mui/icons-material/HighlightOff'


// other packages import
// external imports
import SkeletonLoader from '../customComponents/SkeletonLoader';
import CustomEditIcon from '../customComponents/CustomEditIcon';
import CustomDeleteIcon from '../customComponents/CustomDeleteIcon';
import CustomRemove from '../customComponents/CustomRemove';
import ViewWorkExperienceSheet from './ViewWorkExperienceSheet';
import Add from './Add'
import Update from './Update';
import TableUpdates from './TableUpdates';
// external import function
import ReloadTable from '../../../../assets/img/reloadingtable.svg'
import { handleUpdate, handleDeleteLocal, handleUndo, getWorkExperienceUpdates } from './Controller'
import { handlePaginationChangeFunction, handleViewFile, handleViewToAddFile } from '../customFunctions/CustomFunctions'

import moment from 'moment';


function WorkExperience() {
  // use params
  const pdsParam = useParams()
  // loader
  const [loader, setLoader] = useState(false)
  // media query
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  // local component states
  const [workExperience, setWorkExperience] = useState([])
  const [workExperienceUpdates, setWorkExperienceUpdates] = useState([])
  const [workExperienceRecord, setWorkExperienceRecord] = useState([])
  const [defaultState, setDefaultState] = useState([])
  const [pageLoad, setPageLoad] = useState(true)
  // modal states adding work experience
  const [openAddModal, setOpenAddModal] = useState(false);
  const handleOpenAddModal = () => setOpenAddModal(true)
  const handleCloseAddModal = () => setOpenAddModal(false);
  // modal states update work experience
  const firstRender = useRef(true)
  const [updateRecordState, setUpdateRecordState] = useState('')
  const [updateRecordTrigger, setUpdateRecordTrigger] = useState(false)
  const [openUpdateRecord, setOpenUpdateRecord] = useState(false);
  const handleOpenUpdateRecordModal = (work) => {
    setUpdateRecordState(work)
    setUpdateRecordTrigger(true)
  }
  const handleCloseUpdateRecordModal = () => {
    setOpenUpdateRecord(false)
    setUpdateRecordTrigger(false)
  };

  //  modal state table updates
  const [openTableModal, setOpenTableModal] = useState(false);
  const hOpenTableModal = () => setOpenTableModal(true)
  const hCloseTableModal = () => setOpenTableModal(false);

  // modal work experience sheet
  const [openWorkExperienceModal, setOpenWorkExperienceModal] = useState(false)
  const [workExperienceModalData, setWorkExperienceModalData] = useState({})
  const handleOpenWorkExperience = (item) => {
    setWorkExperienceModalData(item)
    setOpenWorkExperienceModal(true)
  }
  const handleCloseWorkExperience = () => setOpenWorkExperienceModal(false)

  // pagination
  const [tableData, setTableData] = useState([])
  const [page, setPage] = useState(1);
  const [pageTotal, setPageTotal] = useState(0)
  const [perPage, setPerPage] = useState(5)
  const handleChange = (event, value) => {
    // if (page !== value)
    handlePaginationChangeFunction(value, setPage, workExperience, setWorkExperience, setTableData, perPage)
  };
  // functions
  const handleReloadTable = () => {
    Swal.fire({
      text: 'reloading the table . . .',
      icon: 'info',
      allowOutsideClick: false,
    })
    Swal.showLoading()
    setWorkExperienceRecord([])
    let controller = new AbortController()
    getWorkExperienceUpdates(pdsParam.id, setWorkExperience, controller, setPageTotal, perPage, setTableData, setWorkExperienceUpdates, setDefaultState, setLoader)
  }

  useEffect(() => {
    const controller = new AbortController()
    if (pdsParam.id && localStorage.getItem('hris_roles') === '1') {
      getWorkExperienceUpdates(pdsParam.id, setWorkExperience, controller, setPageTotal, perPage, setTableData, setWorkExperienceUpdates, setDefaultState, setLoader)
    }
    else {
      getWorkExperienceUpdates('', setWorkExperience, controller, setPageTotal, perPage, setTableData, setWorkExperienceUpdates, setDefaultState, setLoader)
    }

    // clean up
    return () => {
      controller.abort()
    }
  }, [])

  // run this if update button is click, skips the first render
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
      {/* add new record */}
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
            top: '52%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: matches ? '90%' : '40%',
            height: matches ? '75%' : '80%',
            bgcolor: 'background.paper',
            borderRadius: '1rem',
            boxShadow: 24,
            p: 2,
            pt: 2
          }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>ADD WORK EXPERIENCE</Typography></Box>
            <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
              <Tooltip title="close modal">
                <HighlightOffIcon fontSize='large' onClick={handleCloseAddModal} sx={{ cursor: 'pointer', color: red[200] }} />
              </Tooltip>
            </Box>
            <Add handleClose={handleCloseAddModal} workExperience={workExperience} setWorkExperience={setWorkExperience} workExperienceRecord={workExperienceRecord} setWorkExperienceRecord={setWorkExperienceRecord} tableData={tableData} setTableData={setTableData} setPage={setPage} page={page} perPage={perPage} setPageTotal={setPageTotal} />
          </Box>
        </Fade>
      </Modal>
      {/*  */}
      {/* Update Record */}
      <Modal
        aria-labelledby="transition-modal-add-child"
        aria-describedby="transition-modal-add-child"
        open={openUpdateRecord}
        // onClose={handleCloseUpdateRecordModal}
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
            top: '52%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: matches ? '90%' : '80%',
            height: matches ? '70%' : '80%',
            bgcolor: 'background.paper',
            borderRadius: '1rem',
            boxShadow: 24,
            p: 2,
            pt: 1
          }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>UPDATE WORK EXPERIENCE</Typography></Box>
            <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
              <Tooltip title="close modal">
                <HighlightOffIcon fontSize='large' onClick={handleCloseUpdateRecordModal} sx={{ cursor: 'pointer', color: red[200] }} />
              </Tooltip>
            </Box>
            <Update handleClose={handleCloseUpdateRecordModal} data={updateRecordState} workExperience={workExperience} setWorkExperience={setWorkExperience} workExperienceRecord={workExperienceRecord} setWorkExperienceRecord={setWorkExperienceRecord} tableData={tableData} setTableData={setTableData} />
          </Box>
        </Fade>
      </Modal>
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
            <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>{!pdsParam.id && localStorage.getItem('hris_roles') !== '1' && workExperienceUpdates.length > 0 ? 'PENDING UPDATES' : 'CHECK TABLE UPDATES'}</Typography></Box>
            <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
              <Tooltip title="close modal">
                <HighlightOffIcon fontSize='large' onClick={hCloseTableModal} sx={{ cursor: 'pointer', color: red[200] }} />
              </Tooltip>
            </Box>
            <TableUpdates handleClose={hCloseTableModal} workExperience={workExperience} setWorkExperience={setWorkExperience} workExperienceUpdates={workExperienceUpdates ? workExperienceUpdates : []} setWorkExperienceUpdates={setWorkExperienceUpdates} pdsParam={pdsParam || ''} />
            {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', position: 'absolute', bottom: 10, right: 10 }}>
              <Button variant='contained' color="error" size="small" sx={{ mt: 1 }} onClick={hCloseTableModal}>
                close
              </Button>
            </Box> */}
          </Box>
        </Fade>
      </Modal>
      {/* work experience sheet modal */}
      <Modal
        sx={{ zIndex: 999 }}
        aria-labelledby="transition-modal-add-child"
        aria-describedby="transition-modal-add-child"
        open={openWorkExperienceModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openWorkExperienceModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            height: '80%',
            transform: 'translate(-50%, -50%)',
            width: matches ? '80%' : 'auto',
            // bgcolor: 'background.paper',
            bgcolor: 'background.paper',
            borderRadius: '1rem',
            boxShadow: 24,
            px: 2,
            pt: 3,
            pb: 4,
          }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>{!pdsParam.id && localStorage.getItem('hris_roles') !== '1' && workExperienceUpdates.length > 0 ? 'EXPERIENCE SHEET' : 'WORK EXPERIENCE SHEET'}</Typography></Box>
            <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
              <Tooltip title="close modal">
                <HighlightOffIcon fontSize='large' onClick={handleCloseWorkExperience} sx={{ cursor: 'pointer', color: red[200] }} />
              </Tooltip>
            </Box>
            <ViewWorkExperienceSheet data={workExperienceModalData} />
            {/* <TableUpdates handleClose={hCloseTableModal} workExperience={workExperience} setWorkExperience={setWorkExperience} workExperienceUpdates={workExperienceUpdates ? workExperienceUpdates : []} setWorkExperienceUpdates={setWorkExperienceUpdates} pdsParam={pdsParam || ''} /> */}
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
          <Fade in>
            <Box>
              {!matches && <Typography variant="body2" color="#fff" sx={{ bgcolor: 'primary.main', p: .5, px: 1, borderRadius: .5, mb: 1 }}>WORK EXPERIENCE</Typography>}
              <Box sx={{ mb: 1, display: 'flex', justifyContent: pdsParam.id && localStorage.getItem('hris_roles') === '1' ? 'flex-end' : 'space-between' }} className="side-add-button">
                <Box sx={{ flex: 1 }}>
                  <Tooltip title="reload table">
                    <CachedIcon fontSize='large' className='reloader-icons' onClick={handleReloadTable} />
                  </Tooltip>
                </Box>
                {pdsParam.id && localStorage.getItem('hris_roles') === '1' ? (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
                    {pdsParam.id && localStorage.getItem('hris_roles') === '1' && workExperienceUpdates.length > 0 ? (
                      <Button variant="contained" className='pending-updates-btn' onClick={hOpenTableModal} color="warning" startIcon={<ErrorIcon fontSize='large' className="pulsive-button" />}>
                        {matches ? 'UPDATES' : (<b>check available table updates</b>)}
                      </Button>
                    ) : null}
                  </Box>
                ) : null}
                {!pdsParam.id && workExperienceUpdates.length > 0 ? (
                  <Box>
                    <Button variant="contained" className='pending-updates-btn' color="warning" onClick={hOpenTableModal} startIcon={<ErrorIcon fontSize='large' className="pulsive-button" />}>
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
                <Table aria-label="work experience table" size="small">
                  <TableHead color="primary" className="head_primary">
                    <TableRow>
                      {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                        <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size' ></Typography></TableCell>
                      )}
                      <TableCell align="center" className='cgb-color-table'>
                        <Typography className='table-font-size' >INCLUSIVE DATES <br /> (mm/dd/yyyy)</Typography>
                        <Table>
                          <TableBody>
                            <TableRow sx={{ display: 'flex', justifyContent: 'space-around' }}>
                              <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size'></Typography></TableCell>
                              <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size'>From</Typography></TableCell>
                              <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size'>To</Typography></TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableCell>
                      <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size' >POSITION TITLE <br /> (Write in full/Do not abbreviate)</Typography></TableCell>
                      <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size' >DEPARTMENT/AGENCY/OFFICE/COMPANY <br /> (Write in full/Do not abbreviate)</Typography></TableCell>
                      <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size' >MONTHLY SALARY</Typography></TableCell>
                      <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size' >SALARY/JOB/PAY GRADE(if applicable) & STEP (Formal*00-0)/INCREMENT</Typography></TableCell>
                      <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size' >STATUS OF APPOINTMENT</Typography></TableCell>
                      <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size' >WORK EXPERIENCE SHEET</Typography></TableCell>
                      <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size' >GOV'T SERVICE<br />(Y/N)</Typography></TableCell>
                      <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size' >ATTACHED FILE</Typography></TableCell>

                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData && tableData.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{ bgcolor: item.isNew ? blue[300] : item.isDelete ? red[300] : item.isUpdated ? yellow[500] : null, p: 0, m: 0, '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                          <TableCell sx={{ bgcolor: '#fff' }}>
                            {item.isNew || item.isDelete || item.isUpdated ? (
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <CustomRemove color={item.isNew ? blue[700] : item.isDelete ? red[700] : item.isUpdated ? yellow[700] : null} onClick={() => handleUndo(item, workExperience, setWorkExperience, workExperienceRecord, setWorkExperienceRecord, tableData, setTableData, defaultState, setPageTotal)} />
                              </Box>
                            ) : (
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <CustomEditIcon onClick={() => handleOpenUpdateRecordModal(item)} />
                                <CustomDeleteIcon onClick={() => handleDeleteLocal(item, index, workExperienceRecord, setWorkExperienceRecord, workExperience, setWorkExperience, tableData, setTableData)} />
                              </Box>
                            )}

                          </TableCell>
                        )}
                        <TableCell component="th" scope="row">
                          <Table>
                            <TableBody>
                              <TableRow sx={{ display: 'flex', justifyContent: 'space-around' }}>
                                <TableCell align="center"><Typography className='table-font-size' sx={{ color: '#5c5c5c' }}><b>{page === 1 ? index + 1 : (index + 1) + ((page - 1) * perPage)}</b></Typography></TableCell>
                                <TableCell align="center"><Typography className='table-font-size' sx={{ color: '#5c5c5c' }}><b>{item.datefrom ? moment(item.datefrom).format('MM/DD/YYYY') : '-'}</b></Typography></TableCell>
                                <TableCell align="center"><Typography className='table-font-size' sx={{ color: '#5c5c5c' }}><b>{item.dateto === 'PRESENT' ? 'PRESENT' : item.dateto ? moment(item.dateto).format('MM/DD/YYYY') : '-'}</b></Typography></TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableCell>
                        <TableCell align="center" className='table-font-size' sx={{ color: '#5c5c5c' }}><b>{item.positiontitle ? item.positiontitle : '-'}</b></TableCell>
                        <TableCell align="center" className='table-font-size' sx={{ color: '#5c5c5c' }}><b>{item.agency ? item.agency : '-'}</b></TableCell>
                        <TableCell align="center" className='table-font-size' sx={{ color: '#5c5c5c' }}><b>{item.salary ? item.salary : '-'}</b></TableCell>
                        <TableCell align="center" className='table-font-size' sx={{ color: '#5c5c5c' }}><b>{item.salgrade ? item.salgrade : '-'}</b></TableCell>
                        <TableCell align="center" className='table-font-size' sx={{ color: '#5c5c5c' }}><b>{item.status ? item.status : '-'}</b></TableCell>
                        <TableCell align="center" className='table-font-size' sx={{ color: '#5c5c5c' }}><b>{item.work_experience_sheet ? <Button variant='contained' size="small" onClick={() => handleOpenWorkExperience(item.isNew ? item?.work_experience_sheet : item.isUpdated ? item?.work_experience_sheet : JSON.parse(item?.work_experience_sheet))}>view</Button> : '-'}</b></TableCell>
                        <TableCell align="center" className='table-font-size' sx={{ color: '#5c5c5c' }}><b>{item.govt === 1 ? 'Y' : 'N'}</b></TableCell>
                        <TableCell align="center">
                          {item.file_path ? (
                            <>
                              {item.isNew ? (
                                <Tooltip title="view attached file">
                                  <AttachFileIcon onClick={() => handleViewToAddFile(item.file_path)} sx={{ color: blue[600], cursor: 'pointer', '&:hover': { color: blue[800] }, transform: 'rotate(30DEG)' }} />
                                </Tooltip>
                              ) : (
                                <Tooltip title="view attached file">
                                  <AttachFileIcon onClick={() => item.isUpdated ? handleViewToAddFile(item.file_path) : handleViewFile(item.id, 'workexperience/viewAttachFile')} sx={{ color: blue[600], cursor: 'pointer', '&:hover': { color: blue[800] }, transform: 'rotate(30DEG)' }} />
                                </Tooltip>
                              )}

                            </>

                          ) : (
                            <Typography sx={{ color: '#fff', bgcolor: red[500], textAlign: 'center', borderRadius: '.2rem' }}>no file</Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <Pagination count={Math.ceil(pageTotal / perPage)} page={page} variant="outlined" color="primary" onChange={handleChange} />
              </Stack>
              {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                <Box className="side-add-button">
                  <Button variant="contained" sx={{ color: '#fff', borderRadius: '2rem' }} color="success" onClick={() => handleUpdate(pdsParam.id ? pdsParam.id : localStorage.getItem('hris_employee_id'), workExperienceRecord, setWorkExperienceRecord, setWorkExperience, defaultState, setTableData, perPage, setPage,setPageTotal)} > Submit update</Button>
                </Box>
              )}
            </Box>
          </Fade>
        )}
      </Grid>
    </Grid>
  )
}

export default WorkExperience