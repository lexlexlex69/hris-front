import React, { useEffect, useState, useRef } from 'react'
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
import Swal from 'sweetalert2'
// mui icons components
import AddIcon from '@mui/icons-material/Add';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ErrorIcon from '@mui/icons-material/Error';
import CachedIcon from '@mui/icons-material/Cached';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
// redux
import { useDispatch, useSelector } from 'react-redux'
import ReloadTable from '../../../../assets/img/reloadingtable.svg'
import moment from 'moment';

// external imports
import SkeletonLoader from '../customComponents/SkeletonLoader'
import CustomEditIcon from '../customComponents/CustomEditIcon';
import CustomDeleteIcon from '../customComponents/CustomDeleteIcon';
import CustomRemove from '../customComponents/CustomRemove';
import Warning from '../customComponents/Warning'
import Add from './Add';
import Update from './Update'
import TableUpdates from './TableUpdates'
// external function 
import { getEmployeeVoluntary, handleDeleteLocal, handleUpdate, handleUndo, getVoluntaryUpdates } from './Controller'
import { handlePaginationChangeFunction, handleViewFile, handleViewToAddFile } from '../customFunctions/CustomFunctions'

function VoluntaryWork() {
  // use params
  const pdsParam = useParams()
  // loader
  const [loader, setLoader] = useState(false)
  // redux
  const dispatch = useDispatch()
  const darkmode = useSelector(state => state.darkmode)

  // media query
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  // components state
  const [voluntary, setVoluntary] = useState([])
  const [voluntaryUpdates, setVoluntaryUpdates] = useState([])
  const [voluntaryRecord, setVoluntaryRecord] = useState([])
  const [defaultState, setDefaultState] = useState([])
  const [pageTotal, setPageTotal] = useState(0)

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
    setOpenUpdateRecord(false);
  }

  //  modal state table updates
  const [openTableModal, setOpenTableModal] = useState(false);
  const hOpenTableModal = () => setOpenTableModal(true)
  const hCloseTableModal = () => setOpenTableModal(false);

  // pagination
  const [tableData, setTableData] = useState([])
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = useState(5)
  const handleChange = (event, value) => {
    // if (page !== value)
      handlePaginationChangeFunction(value, setPage, voluntary, setVoluntary, setTableData, perPage)
  };

  const handleReloadTable = () => {
    Swal.fire({
      text: 'reloading the table . . .',
      icon: 'info',
      allowOutsideClick: false,
    })
    Swal.showLoading()
    setVoluntaryRecord([])
    let controller = new AbortController()
    getVoluntaryUpdates(pdsParam.id, setVoluntary, controller, setPageTotal, perPage, setTableData, setVoluntaryUpdates, setDefaultState, setLoader)
  }

  useEffect(() => {
    let controller = new AbortController()
    if (pdsParam.id && localStorage.getItem('hris_roles') === '1') {
      getVoluntaryUpdates(pdsParam.id, setVoluntary, controller, setPageTotal, perPage, setTableData, setVoluntaryUpdates, setDefaultState, setLoader)
    }
    else {
      getVoluntaryUpdates('', setVoluntary, controller, setPageTotal, perPage, setTableData, setVoluntaryUpdates, setDefaultState, setLoader)
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
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: matches ? '90%' : '40%',
            height: '80%',
            bgcolor: 'background.paper',
            borderRadius: '1rem',
            boxShadow: 24,
            p: 1,
            pt: 1
          }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>ADD VOLUNTARY WORK</Typography></Box>
            <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
              <Tooltip title="close modal">
                <HighlightOffIcon fontSize='large' onClick={handleCloseAddModal} sx={{ cursor: 'pointer', color: red[200] }} />
              </Tooltip>
            </Box>
            <Add handleClose={handleCloseAddModal} voluntary={voluntary} setVoluntary={setVoluntary} voluntaryRecord={voluntaryRecord} setVoluntaryRecord={setVoluntaryRecord} page={page} setPageTotal={setPageTotal} tableData={tableData} setTableData={setTableData} perPage={perPage} />
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
            width: matches ? '80%' : '80%',
            bgcolor: 'background.paper',
            borderRadius: '1rem',
            boxShadow: 24,
            height: '80%',
            p: 2,
          }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>UPDATE VOLUNTARY WORK</Typography></Box>
            <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
              <Tooltip title="close modal">
                <HighlightOffIcon fontSize='large' onClick={handleCloseUpdateRecordModal} sx={{ cursor: 'pointer', color: red[200] }} />
              </Tooltip>
            </Box>
            <Update data={updateRecordState} handleClose={handleCloseUpdateRecordModal} voluntary={voluntary} setVoluntary={setVoluntary} voluntaryRecord={voluntaryRecord} setVoluntaryRecord={setVoluntaryRecord} tableData={tableData} setTableData={setTableData} />
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
            <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>{!pdsParam.id && localStorage.getItem('hris_roles') !== '1' && voluntaryUpdates.length > 0 ? 'PENDING UPDATES' : 'CHECK TABLE UPDATES'}</Typography></Box>
            <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
              <Tooltip title="close modal">
                <HighlightOffIcon fontSize='large' onClick={hCloseTableModal} sx={{ cursor: 'pointer', color: red[200] }} />
              </Tooltip>
            </Box>
            <TableUpdates handleClose={hCloseTableModal} voluntary={voluntary} setVoluntary={setVoluntary} voluntaryUpdates={voluntaryUpdates ? voluntaryUpdates : []} setVoluntaryUpdates={setVoluntaryUpdates} pdsParam={pdsParam || ''} />
          </Box>
        </Fade>
      </Modal>
      <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: 'flex', gap: 1, flexDirection: 'column', borderRadius: '.5rem' }} >
        {!loader ? (
          <SkeletonLoader />
        ) : (
          <>
          {!matches && <Typography variant="body2" color="#fff" sx={{bgcolor:'primary.main',p:.5,px:1,borderRadius:.5}}>VOLUNTARY WORK ON INVOLMENT IN CIVIC/NON-GOVERNMENT/PEOPLE/VOLUNTARY ORGANIZATION/S</Typography>}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ flex: 1 }}>
                <Tooltip title="reload table">
                  <CachedIcon fontSize='large' className='reloader-icons' onClick={handleReloadTable} />
                </Tooltip>
              </Box>
              {pdsParam.id && localStorage.getItem('hris_roles') === '1' ? (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }} className="side-add-button">
                  {pdsParam.id && localStorage.getItem('hris_roles') === '1' && voluntaryUpdates.length > 0 ? (
                    <Button variant="contained" className='pending-updates-btn' onClick={hOpenTableModal} color="warning" startIcon={<ErrorIcon fontSize='large' className="pulsive-button" />}>
                      {matches ? 'UPDATES' : (<b>check available table updates</b>)}
                    </Button>
                  ) : null}
                </Box>
              ) : null}
              {!pdsParam.id && voluntaryUpdates.length > 0 ? (
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
              <Table aria-label="simple table" size="small">
                <TableHead>
                  <TableRow>
                    {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                      <TableCell className='cgb-color-table' align="center"><Typography className='table-font-size' sx={{ color: '#fff' }}></Typography></TableCell>
                    )}
                    <TableCell className='cgb-color-table' align="center"><Typography className='table-font-size' sx={{ color: '#fff' }}></Typography></TableCell>
                    <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size' sx={{ color: '#fff' }}>NAME AND ADDRESS OF ORGANIZATION</Typography></TableCell>
                    <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size' sx={{ color: '#fff' }}>INCLUSIVE DATES <br /> (mm/dd/yyyy)</Typography>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>From</TableCell>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>To</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableCell>
                    <TableCell className='cgb-color-table' align="center"><Typography className='table-font-size' sx={{ color: '#fff' }}>NUMBER OF HOURS</Typography></TableCell>
                    <TableCell className='cgb-color-table' align="center"><Typography className='table-font-size' sx={{ color: '#fff' }}>POSITION / NATURE OF WORK</Typography></TableCell>
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
                                <CustomRemove color={item.isNew ? blue[700] : item.isDelete ? red[700] : item.isUpdated ? yellow[700] : null} onClick={() => handleUndo(item, voluntary, setVoluntary, voluntaryRecord, setVoluntaryRecord, tableData, setTableData, defaultState,setPageTotal)} />
                              </Box>
                            ) : (
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="Edit record">
                                  <CustomEditIcon onClick={() => handleOpenUpdateRecordModal(item)} />
                                </Tooltip>
                                <Tooltip title="Delete record">
                                  <CustomDeleteIcon onClick={() => handleDeleteLocal(item, index, voluntaryRecord, setVoluntaryRecord, voluntary, setVoluntary, tableData, setTableData)} />
                                </Tooltip>
                              </Box>
                            )}
                          </TableCell>
                        )}
                        <TableCell align="center"><Typography className='table-font-size' sx={{ color: '#5c5c5c' }}><b>{page === 1 ? index + 1 : (index + 1) + ((page - 1) * perPage)}</b></Typography></TableCell>
                        <TableCell component="th" scope="row" className='table-font-size' sx={{ color: '#5c5c5c' }}>
                          <b>{item.organization ? item.organization : '-'}</b>
                        </TableCell>
                        <TableCell align="center">
                          <Table>
                            <TableBody>
                              <TableRow>
                                <TableCell className='table-font-size' sx={{ color: '#5c5c5c' }} ><b>{item.datefrom ? moment(item.datefrom).format('MM/DD/YYYY') : 'N/A'}</b></TableCell>
                                <TableCell className='table-font-size' sx={{ color: '#5c5c5c' }} ><b>{item.dateto ? moment(item.dateto).format('MM/DD/YYYY') !== 'Invalid date' ? moment(item.dateto).format('MM/DD/YYYY') : item.dateto : 'N/A'}</b></TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableCell>
                        <TableCell className='table-font-size' align="center" sx={{ color: '#5c5c5c' }}><b>{item.nohrs ? item.nohrs : '-'}</b></TableCell>
                        <TableCell className='table-font-size' align="center" sx={{ color: '#5c5c5c' }}><b>{item.positionwork ? item.positionwork : '-'}</b></TableCell>
                        <TableCell className='table-font-size' align="center">
                          {item.file_path ? (
                            <>
                              {item.isNew ? (
                                <Tooltip title="view attached file">
                                  <AttachFileIcon onClick={() => handleViewToAddFile(item.file_path)} sx={{ color: blue[600], cursor: 'pointer', '&:hover': { color: blue[800] }, transform: 'rotate(30DEG)' }} />
                                </Tooltip>
                              ) : (
                                <Tooltip title="view attached file">
                                  <AttachFileIcon onClick={() => item.isUpdated ? handleViewToAddFile(item.file_path) :  handleViewFile(item.id, 'voluntary/viewAttachFile')} sx={{ color: blue[600], cursor: 'pointer', '&:hover': { color: blue[800] }, transform: 'rotate(30DEG)' }} />
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
                <Button variant="contained" sx={{ color: '#fff', borderRadius: '2rem' }} color="success" onClick={() => handleUpdate(pdsParam.id ? pdsParam.id : localStorage.getItem('hris_employee_id'), voluntaryRecord, setVoluntaryRecord, setVoluntary, defaultState, setTableData, perPage, setPage,setPageTotal)}> Submit update</Button>
              </Box>
            )}
          </>
        )}
      </Grid>
    </Grid>
  )
}

export default VoluntaryWork