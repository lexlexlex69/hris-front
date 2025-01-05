import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom';
// mui components
import { blue, green, red, yellow } from '@mui/material/colors'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
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
import Swal from 'sweetalert2';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// mui icons components
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ErrorIcon from '@mui/icons-material/Error';
import CachedIcon from '@mui/icons-material/Cached';
import AddIcon from '@mui/icons-material/Add';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

// images
import ReloadTable from '../../../../assets/img/reloadingtable.svg'
// import ReloadTable from '../../../../assets/img/reloadtable.svg'
// redux

// educ background controller
import { getEducationalBackground, getEducationUpdates, handleUpdate, deleteChildLocal, handleUndo } from './Controller'

// external components
import SkeletonLoader from '../customComponents/SkeletonLoader';
import CustomDeleteIcon from '../customComponents/CustomDeleteIcon';
import CustomEditIcon from '../customComponents/CustomEditIcon';
import CustomRemove from '../customComponents/CustomRemove';
import Warning from '../customComponents/Warning';
import Update from './Update';
import Add from './Add';
import TableUpdates from './TableUpdates';
//external global functions
import { handleViewFile, handlePaginationChangeFunction, handleViewToAddFile, handleViewFile2 } from '../../pds/customFunctions/CustomFunctions'
import PdsCustomDialog from '../customComponents/PdsCustomDialog';


function EducBackground() {
  // param
  const pdsParam = useParams()
  // loader
  const [loader, setLoader] = useState(false)
  // redux
  // media query
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  // component states
  const [education, setEducation] = useState([])
  const [educationRecord, setEducationRecord] = useState([])
  const [educationUpdates, setEducationUpdates] = useState([])
  const [defaultState, setDefaultState] = useState([])
  const [pageTotal, setPageTotal] = useState(0)

  const [openFileIcon, setOpenFileIcon] = useState(false)
  const [openFileIconIndex, setOpenFileIconIndex] = useState('')
  const handleOpeFileIcon = (id) => {
    setOpenFileIconIndex(id)
    setOpenFileIcon(prev => !prev)
  }

  // modal states adding education
  const [openAddRecord, setOpenAddRecord] = useState(false);
  const handleOpenAddRecordModal = () => setOpenAddRecord(true)
  const handleCloseAddRecordModal = () => setOpenAddRecord(false);

  // modal states update education
  const firstRender = useRef(true)
  const [updateRecordState, setUpdateRecordState] = useState('')
  const [updateRecordTrigger, setUpdateRecordTrigger] = useState(false)
  const [openUpdateRecord, setOpenUpdateRecord] = useState(false);
  const handleOpenUpdateRecordModal = (educ) => {
    setUpdateRecordState(educ)
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
  const [page, setPage] = React.useState(1);
  const perPage = 5
  const handleChange = (event, value) => {
    // if (page !== value)
      handlePaginationChangeFunction(value, setPage, education, setEducation, setTableData, perPage)
  };

  const handleReloadTable = () => {
    Swal.fire({
      text: 'reloading the table . . .',
      icon: 'info',
      allowOutsideClick: false,
    })

    Swal.showLoading()
    setEducationRecord([])
    let controller = new AbortController()
    getEducationUpdates(pdsParam.id, setEducation, controller, setPageTotal, perPage, setTableData, setEducationUpdates, setDefaultState, setLoader)
  }

  // functions
  useEffect(() => {
    const controller = new AbortController()
    if (pdsParam.id && localStorage.getItem('hris_roles') === '1') {
      getEducationUpdates(pdsParam.id, setEducation, controller, setPageTotal, perPage, setTableData, setEducationUpdates, setDefaultState, setLoader)
    }
    else {
      // getEducationalBackground('', setEducation, controller, setPageTotal,perPage, setTableData, setLoader)
      getEducationUpdates('', setEducation, controller, setPageTotal, perPage, setTableData, setEducationUpdates, setDefaultState, setLoader)
    }

    // clean up
    return () => {
      controller.abort()
    }
  }, [])

  // run this is update button is click, skips the first render
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
      <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: 'flex', gap: 1, flexDirection: 'column', bgcolor: '#fff', borderRadius: '.5rem' }} >
        {/* Adding Record */}
        {/* comment sa ming pdsCustomdialog later nani gamiton for nicer ui, for now modal sa */}
        {/* <PdsCustomDialog open={openAddRecord} handleClose={handleCloseAddRecordModal}>
          <Add handleClose={handleCloseAddRecordModal} educationRecord={educationRecord} setEducationRecord={setEducationRecord} education={education} setEducation={setEducation} tableData={tableData} setTableData={setTableData} page={page} perPage={perPage} />
        </PdsCustomDialog> */}
        <Modal
          aria-labelledby="transition-modal-add-child"
          aria-describedby="transition-modal-add-child"
          open={openAddRecord}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
          sx={{ zIndex: 999 }}
        >
          <Fade in={openAddRecord}>
            <Box sx={{
              position: 'absolute',
              top: '50%',
              height: '80%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: matches ? '90%' : '40%',
              bgcolor: 'background.paper',
              borderRadius: '1rem',
              boxShadow: 24,
              p: 2,
              pt: 2
            }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a', fontSize: matches ? '.8rem' : '1rem' }}>ADD EDUCATIONAL BACKGROUND</Typography></Box>
              <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
                <Tooltip title="close modal">
                  <HighlightOffIcon fontSize='large' onClick={handleCloseAddRecordModal} sx={{ cursor: 'pointer', color: red[200] }} />
                </Tooltip>
              </Box>
              <Add handleClose={handleCloseAddRecordModal} educationRecord={educationRecord} setEducationRecord={setEducationRecord} education={education} setEducation={setEducation} tableData={tableData} setTableData={setTableData} page={page} setPageTotal={setPageTotal} perPage={perPage} />
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
            timeout: 500,
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
              height: matches ? '80%' : 'auto',
              bgcolor: 'background.paper',
              borderRadius: '1rem',
              boxShadow: 24,
              p: 4,
            }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a', fontSize: matches ? '.8rem' : '1rem' }}>UPDATE EDUCATIONAL BACKGROUND</Typography></Box>
              <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
                <Tooltip title="close modal">
                  <HighlightOffIcon fontSize='large' onClick={handleCloseUpdateRecordModal} sx={{ cursor: 'pointer', color: red[200] }} />
                </Tooltip>
              </Box>
              <Update educ={updateRecordState} handleClose={handleCloseUpdateRecordModal} handleViewFile={handleViewFile} education={education} setEducation={setEducation} educationRecord={educationRecord} setEducationRecord={setEducationRecord} tableData={tableData} setTableData={setTableData} />
            </Box>
          </Fade>
        </Modal>
        {/* modal for update table */}
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
              height: matches ? '75%' : '80%',
              // bgcolor: 'background.paper',
              bgcolor: 'background.paper',
              borderRadius: '1rem',
              boxShadow: 24,
              px: 2,
              pt: 1,
              pb: 4,
            }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>{!pdsParam.id && localStorage.getItem('hris_roles') !== '1' && educationUpdates.length > 0 ? 'PENDING UPDATES' : 'CHECK TABLE UPDATES'}</Typography></Box>
              <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
                <Tooltip title="close modal">
                  <HighlightOffIcon fontSize='large' onClick={hCloseTableModal} sx={{ cursor: 'pointer', color: red[200] }} />
                </Tooltip>
              </Box>
              <TableUpdates handleClose={hCloseTableModal} education={education} setEducation={setEducation} educationUpdates={educationUpdates ? educationUpdates : []} setEducationUpdates={setEducationUpdates} pdsParam={pdsParam || ''} />
            </Box>
          </Fade>
        </Modal>
        {/*  */}
        {!loader ? (
          <SkeletonLoader />
        ) : (
          <Fade in>
            <div>
              {!matches &&  <Typography variant="body2" color="#fff" sx={{bgcolor:'primary.main',p:.5,px:1,borderRadius:.5,mb:1}}>EDUCATIONAL BACKGROUND</Typography>}
             
              <Box sx={{ mb: 1 }} className="side-add-button">
                <Box sx={{ flex: 1 }}>
                  <Tooltip title="reload table">
                    <CachedIcon fontSize='large' className='reloader-icons' onClick={handleReloadTable} />
                  </Tooltip>
                </Box>
                {pdsParam.id && localStorage.getItem('hris_roles') === '1' ? (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }} className="side-add-button">
                    {pdsParam.id && localStorage.getItem('hris_roles') === '1' && educationUpdates.length > 0 ? (
                      <Button variant="contained" className='pending-updates-btn' color="warning" onClick={hOpenTableModal} startIcon={<ErrorIcon fontSize='large' className="pulsive-button" />}>
                        {matches ? 'UPDATES' : (<b>check available table updates</b>)}
                      </Button>
                    ) : null}
                  </Box>
                ) : null}
                <Box sx={{ display: 'flex' }}>
                  {!pdsParam.id && educationUpdates.length > 0 ? (
                    <Button variant="contained" className='pending-updates-btn' color="warning" onClick={hOpenTableModal} startIcon={<ErrorIcon fontSize='large' className="pulsive-button" />}>
                      {matches ? 'PENDING' : (<b>pending updates</b>)}
                    </Button>
                  ) : null}
                  {pdsParam.id && localStorage.getItem('hris_roles') === '1' ? null : (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }} className="side-add-button">
                      <Tooltip title='add new record' placement='top'>
                        <Button variant='contained' className='add-record-btn' color="primary" onClick={handleOpenAddRecordModal}><AddIcon />add</Button>
                      </Tooltip>
                    </Box>
                  )}
                </Box>
              </Box>
              <TableContainer component={Paper}>
                <Table aria-label="educational background table" size="small">
                  <TableHead>
                    <TableRow>
                      {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                        <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size'>Actions</Typography></TableCell>
                      )}
                      <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size'></Typography> </TableCell>
                      <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size'>LEVEL</Typography> </TableCell>
                      <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size'>NAME OF SCHOOL <br />(write in full)</Typography></TableCell>
                      <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size'>BASIC EDUCATION/DEGREE/COURSE</Typography></TableCell>
                      <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size'>PERIOD ATTENDANCE</Typography>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell><Typography className='table-font-size'>From</Typography></TableCell>
                              <TableCell><Typography className='table-font-size'>To</Typography></TableCell>
                            </TableRow>
                          </TableHead>
                        </Table>
                      </TableCell>
                      <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size'>HIGHEST LEVEL/UNITS EARNED <br /> (if not graduated)</Typography></TableCell>
                      <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size'>YEAR GRADUATED</Typography></TableCell>
                      <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size'>SCHOLARSHIP/ACADEMIC HONORS RECEIVED</Typography></TableCell>
                      <TableCell align="center" className='cgb-color-table'><Typography className='table-font-size'>Attached File</Typography></TableCell>

                    </TableRow>
                  </TableHead>
                  <TableBody>

                    {tableData && tableData.map((educ, index) => (
                      <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, bgcolor: educ.isNew ? blue[300] : educ.isDelete ? red[200] : educ.isUpdated ? yellow[500] : null, color: educ.isNew ? '#fff' : educ.isDelete ? '#fff' : educ.isUpdated ? '#fff' : '#fff' }}
                      >
                        {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                          <TableCell sx={{ bgcolor: '#fff' }}>
                            {educ.isNew || educ.isDelete || educ.isUpdated ? (
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                <CustomRemove color={educ.isNew ? blue[700] : educ.isDelete ? red[700] : educ.isUpdated ? yellow[900] : null} onClick={() => handleUndo(educ, education, setEducation, educationRecord, setEducationRecord, tableData, setTableData, defaultState,setPageTotal)} />
                              </Box>
                            ) : (
                              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', width: '100%' }}>
                                <Tooltip title="Edit record">
                                  <CustomEditIcon onClick={() => handleOpenUpdateRecordModal(educ)} />
                                </Tooltip>
                                <Tooltip title="Delete record">
                                  <CustomDeleteIcon onClick={() => deleteChildLocal(educ, index, educationRecord, setEducationRecord, education, setEducation, tableData, setTableData)} />
                                </Tooltip>
                              </Box>
                            )}

                          </TableCell>
                        )}
                        <TableCell className='table-font-size' align="center"><Typography className='table-font-size' sx={{ color: '#5c5c5c' }}>{page === 1 ? index + 1 : (index + 1) + ((page - 1) * perPage)}</Typography></TableCell>
                        <TableCell component="th" scope="row" className='table-font-size' sx={{ color: '#5c5c5c' }}>
                          <b>{educ.elevel ? educ.elevel.toUpperCase() : '-'}</b>
                        </TableCell>
                        <TableCell align="center" className='table-font-size' sx={{ color: '#5c5c5c' }}><b>{educ.nschool ? educ.nschool : '-'}</b></TableCell>
                        <TableCell align="center" className='table-font-size' sx={{ color: '#5c5c5c' }}><b>{educ.degreecourse ? educ.degreecourse : '-'}</b></TableCell>
                        <TableCell align="center" className='table-font-size' sx={{ color: '#5c5c5c' }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell className='table-font-size' sx={{ color: '#5c5c5c' }}>
                                  <b>{educ.datefrom ? educ.datefrom : '-'}</b>
                                </TableCell>
                                <TableCell className='table-font-size' sx={{ color: '#5c5c5c' }}>
                                  <b>{educ.dateto ? educ.dateto : '-'}</b>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                          </Table>
                        </TableCell>
                        <TableCell align="center" className='table-font-size' sx={{ color: '#5c5c5c' }}><b>{educ.gradelevel ? educ.gradelevel : '-'}</b></TableCell>
                        <TableCell align="center" className='table-font-size' sx={{ color: '#5c5c5c' }}><b>{educ.yeargrad ? educ.yeargrad : '-'}</b></TableCell>
                        <TableCell align="center" className='table-font-size' sx={{ color: '#5c5c5c' }}><b>{educ.honor ? educ.honor : '-'}</b></TableCell>
                        <TableCell align="center">
                          {educ.file_path ? (
                            <>
                              {educ.isNew ? (
                                <Tooltip
                                open={openFileIconIndex === educ.id && openFileIcon}
                                  componentsProps={{
                                    tooltip: {
                                      sx: {
                                        bgcolor: 'background.paper',
                                        '& .MuiTooltip-arrow': {
                                          color: 'warning.main',
                                        },
                                      },
                                    },
                                  }}
                                  title={
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                      {educ.file_path.split('*_____*').map((x, i) => (
                                        <Button startIcon={<AttachFileIcon />} key={i} variant='contained' color="warning" onClick={() => handleViewToAddFile(x)}  >
                                          File {i + 1}
                                        </Button>
                                      ))}
                                    </Box>
                                  }
                                  placement='left'
                                  arrow
                                >
                                  <AttachFileIcon onClick={() => handleOpeFileIcon(educ?.id)} sx={{ color: blue[600], cursor: 'pointer', '&:hover': { color: blue[800] }, transform: 'rotate(30DEG)' }} />
                                </Tooltip>
                              )
                                :
                                educ.isUpdated ? (
                                  <Tooltip
                                    open={openFileIconIndex === educ.id && openFileIcon}
                                    componentsProps={{
                                      tooltip: {
                                        sx: {
                                          bgcolor: 'background.paper',
                                          '& .MuiTooltip-arrow': {
                                            color: 'warning.main',
                                          },
                                        },
                                      },
                                    }}
                                    title={
                                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        {educ.file_path.split('*_____*').map((x, i) => (
                                          <Button startIcon={<AttachFileIcon />} key={i} variant='contained' color="warning" onClick={() => handleViewToAddFile(x)}  >
                                            File {i + 1}
                                          </Button>
                                        ))}
                                      </Box>
                                    }
                                    placement='left'
                                    arrow
                                  >
                                    <AttachFileIcon onClick={() => handleOpeFileIcon(educ?.id)} sx={{ color: blue[600], cursor: 'pointer', '&:hover': { color: blue[800] }, transform: 'rotate(30DEG)' }} />
                                    {/* onClick={() => handleViewToAddFile(educ.file_path)} */}
                                  </Tooltip>
                                )
                                  : (
                                    <Tooltip
                                    open={openFileIconIndex === educ.id && openFileIcon}
                                    componentsProps={{
                                      tooltip: {
                                        sx: {
                                          bgcolor: 'background.paper',
                                          '& .MuiTooltip-arrow': {
                                            color: 'warning.main',
                                          },
                                        },
                                      },
                                    }}
                                    title={
                                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        {educ.file_path.split(';').map((x, i) => (
                                          <Button variant="contained" color="warning" onClick={() => handleViewFile2(educ.id, 'education/viewAddedAttachFile', x)}>
                                            File {i + 1}
                                          </Button>
                                        ))}
                                      </Box>
                                    }
                                      arrow
                                      placement='left'
                                    >
                                      {/* onClick={() => handleViewFile(educ.id, 'education/viewAttachFile')} */}
                                      <AttachFileIcon onClick={() => handleOpeFileIcon(educ?.id)} sx={{ color: blue[600], cursor: 'pointer', '&:hover': { color: blue[800] }, transform: 'rotate(30DEG)' }} />
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
                <Pagination count={Math.ceil(pageTotal / perPage)} variant="outlined" color="primary" page={page} onChange={handleChange} />
              </Stack>
              {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                <Box className="side-add-button">
                  <Button variant="contained" sx={{ color: '#fff', borderRadius: '2rem' }} color="success" onClick={() => handleUpdate(pdsParam.id ? pdsParam.id : localStorage.getItem('hris_employee_id'), educationRecord, setEducationRecord, setEducation, defaultState, setTableData, perPage, setPage,setPageTotal)}> Submit update</Button>
                </Box>
              )}
            </div>
          </Fade>
        )}
      </Grid>
    </Grid >
  )
}

export default EducBackground