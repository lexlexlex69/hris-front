import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { blue, green, red, yellow } from '@mui/material/colors'
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// mui components
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
// mui icons components
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ErrorIcon from '@mui/icons-material/Error';
import CachedIcon from '@mui/icons-material/Cached';
import SendAndArchiveIcon from '@mui/icons-material/SendAndArchive';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import Swal from 'sweetalert2'
// moment
import moment from 'moment'
// redux
import { useDispatch, useSelector } from 'react-redux'
import { getPdsEligibility } from '../../../../redux/slice/pdsEligibility'
import ReloadTable from '../../../../assets/img/reloadingtable.svg'

// external imports
import CustomEditIcon from '../customComponents/CustomEditIcon';
import CustomDeleteIcon from '../customComponents/CustomDeleteIcon';
import SkeletonLoader from '../customComponents/SkeletonLoader';
import CustomRemove from '../customComponents/CustomRemove';
import Warning from '../customComponents/Warning';
import Add from './Add'
import Update from './Update';
import TableUpdates from './TableUpdates';
// external imports function 
import { getEligibility, handleUpdate, handleDeleteLocal, handleUndo, getEligibilityUpdates } from './Controller';
// pds global function
import { handleViewFile, handlePaginationChangeFunction, handleViewToAddFile } from '../../../layout/pds/customFunctions/CustomFunctions'


function Eligibility() {
  // param
  const pdsParam = useParams()
  // loader
  const [loader, setLoader] = useState(false)
  // redux
  const dispatch = useDispatch()

  // local component states
  const [eligibility, setEligibility] = useState([])
  const [eligibilityRecord, setEligibilityRecord] = useState([])
  const [eligibilityUpdates, setEligibilityUpdates] = useState([])
  const [defaultState, setDefaultState] = useState([])

  // modal states adding children
  const [openAdd, setOpenAdd] = useState(false);
  const handleOpenAddModal = () => setOpenAdd(true)
  const handleCloseAddModal = () => setOpenAdd(false);

  // modal states update children
  const firstRender = useRef(true)
  const [updateRecordState, setUpdateRecordState] = useState('')
  const [updateRecordTrigger, setUpdateRecordTrigger] = useState(false)
  const [openUpdateRecord, setOpenUpdateRecord] = useState(false);
  const handleOpenUpdateRecordModal = (eli) => {
    setUpdateRecordState(eli)
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
  const [pageTotal, setPageTotal] = useState(0)
  const [tableData, setTableData] = useState([])
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = useState(5)
  const handleChange = (event, value) => {
    // if (page !== value)
    handlePaginationChangeFunction(value, setPage, eligibility, setEligibility, setTableData, perPage)
  };

  // reload
  const handleReloadTable = () => {
    Swal.fire({
      text: 'reloading the table . . .',
      icon: 'info',
      allowOutsideClick: false,
    })
    Swal.showLoading()
    setEligibilityRecord([])
    let controller = new AbortController()
    getEligibilityUpdates(pdsParam.id, setEligibility, controller, setPageTotal, perPage, setTableData, setEligibilityUpdates, setDefaultState, setLoader)
  }
  // media query
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const controller = new AbortController()
    if (pdsParam.id && localStorage.getItem('hris_roles') === '1') {
      getEligibilityUpdates(pdsParam.id, setEligibility, controller, setPageTotal, perPage, setTableData, setEligibilityUpdates, setDefaultState, setLoader)
    }
    else {
      getEligibilityUpdates('', setEligibility, controller, setPageTotal, perPage, setTableData, setEligibilityUpdates, setDefaultState, setLoader)
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
      <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: 'flex', gap: 1, flexDirection: 'column', bgcolor: '#fff', borderRadius: '.5rem', height: '100%' }} >
        {/* Adding Record */}
        <Modal
          aria-labelledby="transition-modal-add-child"
          aria-describedby="transition-modal-add-child"
          open={openAdd}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 300,
          }}
          sx={{ zIndex: 999 }}
        >
          <Fade in={openAdd}>
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: matches ? '90%' : '50%',
              height: '80%',
              bgcolor: 'background.paper',
              borderRadius: '1rem',
              boxShadow: 24,
              p: 2,
              pt: 1,
            }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>ADD ELIGIBILITY</Typography></Box>
              <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
                <Tooltip title="close modal">
                  <HighlightOffIcon fontSize='large' onClick={handleCloseAddModal} sx={{ cursor: 'pointer', color: red[200] }} />
                </Tooltip>
              </Box>
              <Add handleClose={handleCloseAddModal} eligibility={eligibility} setEligibility={setEligibility} eligibilityRecord={eligibilityRecord} setEligibilityRecord={setEligibilityRecord} page={page} setPageTotal={setPageTotal} tableData={tableData} setTableData={setTableData} perPage={perPage} />
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
              height: matches ? '80%' : 'auto',
              transform: 'translate(-50%, -50%)',
              width: matches ? '90%' : '80%',
              bgcolor: 'background.paper',
              borderRadius: '1rem',
              boxShadow: 24,
              p: 2,
            }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>UPDATE ELIGIBILITY</Typography></Box>
              <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
                <Tooltip title="close modal">
                  <HighlightOffIcon fontSize='large' onClick={handleCloseUpdateRecordModal} sx={{ cursor: 'pointer', color: red[200] }} />
                </Tooltip>
              </Box>
              <Update eli={updateRecordState} handleClose={handleCloseUpdateRecordModal} eligibility={eligibility} setEligibility={setEligibility} eligibilityRecord={eligibilityRecord} setEligibilityRecord={setEligibilityRecord} tableData={tableData} setTableData={setTableData} />
            </Box>
          </Fade>
        </Modal>
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
              <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>{!pdsParam.id && localStorage.getItem('hris_roles') !== '1' && eligibilityUpdates.length > 0 ? 'PENDING UPDATES' : 'CHECK TABLE UPDATES'}</Typography></Box>
              <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
                <Tooltip title="close modal">
                  <HighlightOffIcon fontSize='large' onClick={hCloseTableModal} sx={{ cursor: 'pointer', color: red[200] }} />
                </Tooltip>
              </Box>
              <TableUpdates handleClose={hCloseTableModal} eligibility={eligibility} setEligibility={setEligibility} eligibilityUpdates={eligibilityUpdates ? eligibilityUpdates : []} setEligibilityUpdates={setEligibilityUpdates} pdsParam={pdsParam || ''} />
            </Box>
          </Fade>
        </Modal>
        {!loader ? (
          <SkeletonLoader />
        ) : (
          <Fade in>
            <Box>
              {!matches && <Typography variant="body2" color="#fff" sx={{ bgcolor: 'primary.main', p: .5, px: 1, borderRadius: .5, mb: 1 }}>CIVIL SERVICE ELIGIBILITY</Typography>}
              <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }} className="side-add-button">
                <Box sx={{ flex: 1 }}>
                  <Tooltip title="reload table">
                    <CachedIcon fontSize='large' className='reloader-icons' onClick={handleReloadTable} />
                  </Tooltip>
                </Box>
                {pdsParam.id && localStorage.getItem('hris_roles') === '1' ? (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }} className="side-add-button">
                    {pdsParam.id && localStorage.getItem('hris_roles') === '1' && eligibilityUpdates.length > 0 ? (
                      <Button variant="contained" className='pending-updates-btn' onClick={hOpenTableModal} color="warning" startIcon={<ErrorIcon fontSize='large' className="pulsive-button" />}>
                        {matches ? 'UPDATES' : (<b>check available table updates</b>)}
                      </Button>
                    ) : null}
                  </Box>
                ) : null}
                {!pdsParam.id && eligibilityUpdates.length > 0 ? (
                  <Box>
                    <Button variant="contained" className='pending-updates-btn' color="warning" onClick={hOpenTableModal} startIcon={<ErrorIcon fontSize='large' className="pulsive-button" />}>
                      {matches ? 'PENDING' : (<b>Pending Updates</b>)}
                    </Button>
                  </Box>
                ) : null}
                {pdsParam.id && localStorage.getItem('hris_roles') ? null : (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }} className="side-add-button">
                    <Tooltip title="add new record" placement='top'>
                      <Button variant='contained' className='add-record-btn' color="primary" onClick={handleOpenAddModal}><AddIcon />add</Button>
                    </Tooltip>
                  </Box>
                )}
              </Box>
              <TableContainer component={Paper}>
                <Table aria-label="simple table" size="small">
                  <TableHead>
                    <TableRow>
                      {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                        <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size'>ACTIONS</Typography></TableCell>
                      )}
                      <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size'></Typography></TableCell>
                      <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size'>CAREER SERVICE/RA 1080 (BOARD/BAR/) UNDER SPECIAL LAW/CES/CSEE BARANGAY ELIGIBILITY/DRIVER'S LICENSE</Typography></TableCell>
                      <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size'>RATING <br /> (if applicable)</Typography></TableCell>
                      <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size'>DATE of EXAMINATION / CONFERMENT</Typography></TableCell>
                      <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size'>PLACE OF EXAMINATION</Typography></TableCell>
                      <TableCell align="center" className='cgb-color-table'>
                        <Typography className='table-font-size'>LICENSE (If applicable)</Typography>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                <Typography className='table-font-size'>Number</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography className='table-font-size'>Date of validity</Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableCell>
                      <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size'>ATTACHED FILE</Typography></TableCell>

                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData && tableData.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, bgcolor: item.isNew ? blue[300] : item.isDelete ? red[300] : item.isUpdated ? yellow[500] : null }}
                      >
                        {
                          localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                            <TableCell sx={{ bgcolor: '#fff' }}>
                              {item.isNew || item.isDelete || item.isUpdated ? (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                  <CustomRemove color={item.isNew ? blue[700] : item.isDelete ? red[700] : item.isUpdated ? yellow[700] : null} onClick={() => handleUndo(item, eligibility, setEligibility, eligibilityRecord, setEligibilityRecord, tableData, setTableData, defaultState, setPageTotal)} />
                                </Box>
                              ) : (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Tooltip title="Edit record">
                                    <CustomEditIcon onClick={() => handleOpenUpdateRecordModal(item)} />
                                  </Tooltip>
                                  <Tooltip title="Delete record">
                                    <CustomDeleteIcon onClick={() => handleDeleteLocal(item, index, eligibilityRecord, setEligibilityRecord, eligibility, setEligibility, tableData, setTableData)} />
                                  </Tooltip>
                                </Box>
                              )}

                            </TableCell>
                          )
                        }
                        <TableCell className='table-font-size' align="center" sx={{ color: '#5c5c5c' }}><Typography className='table-font-size' sx={{ color: '#5c5c5c' }}>{page === 1 ? index + 1 : (index + 1) + ((page - 1) * perPage)}</Typography></TableCell>
                        <TableCell className='table-font-size' component="th" scope="row" sx={{ color: '#5c5c5c' }}>
                          <b>{item.title ? item.title : 'N/A'}</b>
                        </TableCell>
                        <TableCell className='table-font-size' align="center" sx={{ color: '#5c5c5c' }}><b>{item.rating ? item.rating : 'N/A'}</b></TableCell>
                        <TableCell className='table-font-size' align="center" sx={{ color: '#5c5c5c' }}><b>{item.dateofexam ? moment(item.dateofexam).format('MM/DD/YYYY') : 'N/A'}</b></TableCell>
                        <TableCell className='table-font-size' align="center" sx={{ color: '#5c5c5c' }}><b>{item.placeofexam ? item.placeofexam : 'N/A'}</b></TableCell>
                        <TableCell align="center">
                          <Table>
                            <TableBody>
                              <TableRow>
                                <TableCell align="center">
                                  <Typography className='table-font-size' sx={{ color: '#5c5c5c' }}><b>{item.licenseno ? item.licenseno : 'N/A'}</b></Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Typography className='table-font-size' sx={{ color: '#5c5c5c' }}><b>{item.dateissue ? moment(item.dateissue).format('MM/DD/YYYY') !== 'Invalid date' ? moment(item.dateissue).format('MM/DD/YYYY') : item.dateissue : 'N/A'}</b></Typography>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableCell>
                        <TableCell>
                          {item.file_path ? (
                            <>
                              {item.isNew ? (
                                <Tooltip title="view attached file">
                                  <AttachFileIcon onClick={() => handleViewToAddFile(item.file_path)} sx={{ color: blue[600], cursor: 'pointer', '&:hover': { color: blue[800] }, transform: 'rotate(30DEG)' }} />
                                </Tooltip>
                              ) : (
                                <Tooltip title="view attached file">
                                  <AttachFileIcon onClick={() => item.isUpdated ? handleViewToAddFile(item.file_path) : handleViewFile(item.id, 'eligibility/viewAttachFile')} sx={{ color: blue[600], cursor: 'pointer', '&:hover': { color: blue[800] }, transform: 'rotate(30DEG)' }} />
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
                <Pagination count={Math.ceil(Number(pageTotal) / perPage)} variant="outlined" color="primary" page={page} onChange={handleChange} />
              </Stack>
              {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                <Box className="side-add-button">
                  <Button variant="contained" sx={{ color: '#fff', borderRadius: '2rem' }} color="success" onClick={() => handleUpdate(pdsParam.id ? pdsParam.id : localStorage.getItem('hris_employee_id'), eligibilityRecord, setEligibilityRecord, setEligibility, defaultState, setTableData, perPage, setPage, setPageTotal)} > Submit update</Button>
                </Box>
              )}
            </Box>
          </Fade>
        )}
      </Grid>
    </Grid >
  )
}

export default Eligibility