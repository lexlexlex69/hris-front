import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { blue, green, red } from '@mui/material/colors'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import FormControlLabel from '@mui/material/FormControlLabel';
import LinearProgress from '@mui/material/LinearProgress';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Tooltip from '@mui/material/Tooltip'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import Swal from 'sweetalert2';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// redux
import { useDispatch, useSelector } from 'react-redux';
// mui components
import ErrorIcon from '@mui/icons-material/Error';
import CachedIcon from '@mui/icons-material/Cached';
import SendAndArchiveIcon from '@mui/icons-material/SendAndArchive';

import ReloadTable from '../../../../../assets/img/reloadingtable.svg'

import { getOtherItems, handleChangeItem, handleSubmit, handleChangeItemText, getOtherItemsUpdates } from './Controller'

import Updates from './Updates';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function OtherItems() {
  // media query
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  //  
  const pdsParam = useParams()
  // modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // states
  const [itemState, setItemState] = useState(false)
  const [defaultItems, setDefaultItems] = useState([])
  const [updates, setUpdates] = useState('')
  const [items, setItems] = useState({
    _34_a: '',
    _34_b: '',
    _35_a: '',
    _35_b: '',
    _36_a: '',
    _37_a: '',
    _38_a: '',
    _38_b: '',
    _39_a: '',
    _40_a: '',
    _40_b: '',
    _40_c: ''
  })

  const handleReloadData = () => {
    setItemState(false)
    Swal.fire({
      text: 'reloading the table . . .',
      icon: 'info',
      allowOutsideClick: false,
    })
    Swal.showLoading()
    getOtherItemsUpdates(pdsParam.id, items, setItems, setDefaultItems, setItemState, setUpdates)
  }


  useEffect(() => {
    const controller = new AbortController()
    if (pdsParam.id && localStorage.getItem('hris_roles') === '1') {
      getOtherItemsUpdates(pdsParam.id, items, setItems, setDefaultItems, setItemState, setUpdates)
    }
    else {
      getOtherItems('', items, setItems, setDefaultItems, setItemState)
    }

    // clean up
    return () => {
      controller.abort()
    }
  }, [])
  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            height: '80%',
            //  overflowY:'scroll',
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
            <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a',fontSize:matches ? '.8rem' : '1rem' }}>CHECK UPDATES FOR ITEMS 34 to 40</Typography></Box>
            <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
                            <Tooltip title="close modal">
                                <HighlightOffIcon fontSize='large' onClick={handleClose} sx={{ cursor: 'pointer', color: red[200] }} />
                            </Tooltip>
                        </Box>
            <Updates updates={updates && updates} setUpdates={setUpdates} handleClose={handleClose} />
          </Box>
        </Fade>
      </Modal>
      {itemState ? null : (<LinearProgress color="primary" />)}
      <Box sx={{ my: 1, display: 'flex', justifyContent: 'space-between' }}>
        {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? (
          <Tooltip title="reload data">
            <CachedIcon className='reloader-icons' onClick={handleReloadData} />
          </Tooltip>
          // <Button disabled={!itemState} variant='outlined' startIcon={<CachedIcon />} color="primary" onClick={handleReloadData}>Reload data</Button>
        ) : null}
        {localStorage.getItem('hris_roles') === '1' && pdsParam.id && updates.length > 0 ? (
          <Button disabled={!itemState} variant='outlined' color="warning" startIcon={<ErrorIcon fontSize='large' className="pulsive-button" sx={{ color: 'warning.main' }} />} onClick={handleOpen}>{matches ? 'UPDATES' : (<b>Available updates for items 34 to 40</b>)}</Button>
        ) : null}
      </Box>
      <TableContainer component={Paper} sx={{ mb: 1 }}>
        <Table aria-label="children table" size="small">
          <TableBody>
            <TableRow>
              <TableCell width={'70%'}>
                <Typography sx={{ color: itemState ? '' : 'lightText.main' }} >
                  34. <br /> by consanguinity or affinity to the appointing or recommending chief or bureu or office or to the person who has immediate supervision over you in
                  bureau of Department where you will be appointed,
                  <br />
                  a. within the third degree
                  <br />
                  b. within the fourth degree (for Local Goverment Unit - Career Employees)?
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <FormControl
                  >
                    <FormLabel id="radio-34a-group">A</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="radio-34a-group"
                      value={items._34_a && items._34_a.value}
                      name="radio-34a-group"
                    >
                      <FormControlLabel value='1' onClick={(e) => localStorage.getItem('hris_roles') === '1' && pdsParam.id ? '' : handleChangeItem(e.target.value, '_34_a', items._34_a, items, setItems)} control={<Radio />} label="Yes" />
                      <FormControlLabel value='0' onClick={(e) => localStorage.getItem('hris_roles') === '1' && pdsParam.id ? '' : handleChangeItem(e.target.value, '_34_a', items._34_a, items, setItems)} control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                  <FormControl
                  >
                    <FormLabel id="radio-34b-group">B</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="radio-34b-group"
                      value={items._34_b && items._34_b.value}
                      name="radio-34b-group"
                    >
                      <FormControlLabel value={1} control={<Radio />} onClick={(e) => localStorage.getItem('hris_roles') === '1' && pdsParam.id ? '' : handleChangeItem(e.target.value, '_34_b', items._34_b, items, setItems)} label="Yes" />
                      <FormControlLabel value={0} control={<Radio />} onClick={(e) => localStorage.getItem('hris_roles') === '1' && pdsParam.id ? '' : handleChangeItem(e.target.value, '_34_b', items._34_b, items, setItems)} label="No" />
                    </RadioGroup>
                    <Typography>If Yes? give details</Typography>
                    {/* <TextField variant='filled' size="small" focused label="type here" inputRef={_34_bs} disabled={items._34_b && items._34_b.value === 1 ? false : true} key={items._34_b &&  items._34_b.value === 1 ? items._34_b.specify : ''} defaultValue={items._34_b &&  items._34_b.value === 1 ? items._34_b.specify : ''}/> */}
                    <TextField variant='filled' size="small" focused label="type here" disabled={items._34_b && items._34_b.value === 1 ? false : true} value={items._34_b && items._34_b.value === 1 ? items._34_b.specify : ''} onChange={(e) => handleChangeItemText(e.target.value, '_34_b', items._34_b, items, setItems, 1)} />
                  </FormControl>
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell width={'70%'}>
                <Typography sx={{ color: itemState ? '' : 'lightText.main' }}>
                  35. <br />
                  a. Have you ever been found guilty of any administrative offense?
                  <br />
                  b. Have you been criminally charge before any court?
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <FormControl
                  >
                    <FormLabel id="radio-34a-group">A</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="radio-34a-group"
                      value={items._35_a && items._35_a.value}
                      name="radio-34a-group"
                    >
                      <FormControlLabel value={1} onClick={(e) => localStorage.getItem('hris_roles') === '1' && pdsParam.id ? '' : handleChangeItem(e.target.value, '_35_a', items._35_a, items, setItems)} control={<Radio />} label="Yes" />
                      <FormControlLabel value={0} onClick={(e) => localStorage.getItem('hris_roles') === '1' && pdsParam.id ? '' : handleChangeItem(e.target.value, '_35_a', items._35_a, items, setItems)} control={<Radio />} label="No" />
                    </RadioGroup>
                    <Typography>If Yes? give details: </Typography>
                    <TextField variant='filled' size="small" label="type here" disabled={items._35_a && items._35_a.value === 1 ? false : true} value={items._35_a && items._35_a.value === 1 ? items._35_a.specify : ''} onChange={(e) => handleChangeItemText(e.target.value, '_35_a', items._35_a, items, setItems, 1)}></TextField>
                  </FormControl>
                  <FormControl
                  >
                    <FormLabel id="radio-34b-group">B</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="radio-34b-group"
                      value={items._35_b && items._35_b.value}
                      name="radio-34b-group"
                    >
                      <FormControlLabel value={1} onClick={(e) => localStorage.getItem('hris_roles') === '1' && pdsParam.id ? '' : handleChangeItem(e.target.value, '_35_b', items._35_b, items, setItems)} control={<Radio />} label="Yes" />
                      <FormControlLabel value={0} onClick={(e) => localStorage.getItem('hris_roles') === '1' && pdsParam.id ? '' : handleChangeItem(e.target.value, '_35_b', items._35_b, items, setItems)} control={<Radio />} label="No" />
                    </RadioGroup>
                    <Typography>If Yes? give details<br /> Date Filed:  </Typography>
                    <TextField variant='filled' size="small" label="type here (mm/dd/yyyy)" disabled={items._35_b && items._35_b.value === 1 ? false : true} value={items._35_b && items._35_b.value === 1 ? items._35_b.specify : ''} onChange={(e) => handleChangeItemText(e.target.value, '_35_b', items._35_b, items, setItems, 1)}></TextField>
                    <Typography>Status of Case/s: </Typography>
                    <TextField variant='filled' size="small" label="type here" disabled={items._35_b && items._35_b.value === 1 ? false : true} value={items._35_b && items._35_b.value === 1 ? items._35_b.specify2 : ''} onChange={(e) => handleChangeItemText(e.target.value, '_35_b', items._35_b, items, setItems, 2)}></TextField>
                  </FormControl>
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell width={'70%'}>
                <Typography sx={{ color: itemState ? '' : 'lightText.main' }}>
                  36. <br /> Have you ever been convicted of any crime or violation of any law,decree,ordinance or regulation by  any court tribunal?
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <FormControl
                  >
                    <FormLabel id="radio-36a-group"></FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="radio-34a-group"
                      value={items._36_a && items._36_a.value}
                      name="radio-36a-group"
                    >
                      <FormControlLabel value={1} onClick={(e) => localStorage.getItem('hris_roles') === '1' && pdsParam.id ? '' : handleChangeItem(e.target.value, '_36_a', items._36_a, items, setItems)} control={<Radio />} label="Yes" />
                      <FormControlLabel value={0} onClick={(e) => localStorage.getItem('hris_roles') === '1' && pdsParam.id ? '' : handleChangeItem(e.target.value, '_36_a', items._36_a, items, setItems)} control={<Radio />} label="No" />
                    </RadioGroup>
                    <Typography>If Yes? give details </Typography>
                    <TextField variant='filled' size="small" label="type here" disabled={items._36_a && items._36_a.value === 1 ? false : true} value={items._36_a && items._36_a.value === 1 ? items._36_a.specify : ''} onChange={(e) => handleChangeItemText(e.target.value, '_36_a', items._36_a, items, setItems, 1)}></TextField>
                  </FormControl>
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell width={'70%'}>
                <Typography sx={{ color: itemState ? '' : 'lightText.main' }}>
                  37. <br /> Have you ever been separated from the service in any of the following modes: resignation,retirement,dropped from the rolls, dismissal,termination,end of term,finished contact or phased out (abolition) in public or private sector?
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <FormControl
                  >
                    <FormLabel id="radio-37a-group"></FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="radio-37a-group"
                      value={items._37_a && items._37_a.value}
                      name="radio-37a-group"
                    >
                      <FormControlLabel value={1} onClick={(e) => localStorage.getItem('hris_roles') === '1' && pdsParam.id ? '' : handleChangeItem(e.target.value, '_37_a', items._37_a, items, setItems)} control={<Radio />} label="Yes" />
                      <FormControlLabel value={0} onClick={(e) => localStorage.getItem('hris_roles') === '1' && pdsParam.id ? '' : handleChangeItem(e.target.value, '_37_a', items._37_a, items, setItems)} control={<Radio />} label="No" />
                    </RadioGroup>
                    <Typography>If Yes? give details </Typography>
                    <TextField variant='filled' size="small" label="type here" disabled={items._37_a && items._37_a.value === 1 ? false : true} value={items._37_a && items._37_a.value === 1 ? items._37_a.specify : ''} onChange={(e) => handleChangeItemText(e.target.value, '_37_a', items._37_a, items, setItems, 1)}></TextField>
                  </FormControl>
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell width={'70%'}>
                <Typography sx={{ color: itemState ? '' : 'lightText.main' }}>
                  38. <br />a. Have you ever been a candidate in a national or local election held within the last year (except Barangay election)?

                  <br />
                  b. within the fourth degree (for Local Goverment Unit - Career Employees)?
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <FormControl
                  >
                    <FormLabel id="radio-38a-group">A</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="radio-38a-group"
                      value={items._38_a && items._38_a.value}
                      name="radio-38a-group"
                    >
                      <FormControlLabel value={1} onClick={(e) => localStorage.getItem('hris_roles') === '1' && pdsParam.id ? '' : handleChangeItem(e.target.value, '_38_a', items._38_a, items, setItems)} control={<Radio />} label="Yes" />
                      <FormControlLabel value={0} onClick={(e) => localStorage.getItem('hris_roles') === '1' && pdsParam.id ? '' : handleChangeItem(e.target.value, '_38_a', items._38_a, items, setItems)} control={<Radio />} label="No" />
                    </RadioGroup>
                    <Typography>If Yes? give details </Typography>
                    <TextField variant='filled' size="small" label="type here" disabled={items._38_a && items._38_a.value === 1 ? false : true} value={items._38_a && items._38_a.value === 1 ? items._38_a.specify : ''} onChange={(e) => handleChangeItemText(e.target.value, '_38_a', items._38_a, items, setItems, 1)}></TextField>
                  </FormControl>
                  <FormControl
                  >
                    <FormLabel id="radio-38b-group">B</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="radio-38b-group"
                      value={items._38_b && items._38_b.value}
                      name="radio-38b-group"
                    >
                      <FormControlLabel value={1} onClick={(e) => localStorage.getItem('hris_roles') === '1' && pdsParam.id ? '' : handleChangeItem(e.target.value, '_38_b', items._38_b, items, setItems)} control={<Radio />} label="Yes" />
                      <FormControlLabel value={0} onClick={(e) => localStorage.getItem('hris_roles') === '1' && pdsParam.id ? '' : handleChangeItem(e.target.value, '_38_b', items._38_b, items, setItems)} control={<Radio />} label="No" />
                    </RadioGroup>
                    <Typography>If Yes? give details </Typography>
                    <TextField variant='filled' focused size="small" label="type here" disabled={items._38_b && items._38_b.value === 1 ? false : true} value={items._38_b && items._38_b.value === 1 ? items._38_b.specify : ''} onChange={(e) => handleChangeItemText(e.target.value, '_38_b', items._38_b, items, setItems, 1)}></TextField>
                  </FormControl>
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell width={'70%'}>
                <Typography sx={{ color: itemState ? '' : 'lightText.main' }}>
                  39. <br /> Have you acquired the status of an immigrant or permanent resident of another country?
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <FormControl
                  >
                    <FormLabel id="radio-39a-group"></FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="radio-39a-group"
                      value={items._39_a && items._39_a.value}
                      name="radio-39a-group"
                    >
                      <FormControlLabel value={1} onClick={(e) => localStorage.getItem('hris_roles') === '1' && pdsParam.id ? '' : handleChangeItem(e.target.value, '_39_a', items._39_a, items, setItems)} control={<Radio />} label="Yes" />
                      <FormControlLabel value={0} onClick={(e) => localStorage.getItem('hris_roles') === '1' && pdsParam.id ? '' : handleChangeItem(e.target.value, '_39_a', items._39_a, items, setItems)} control={<Radio />} label="No" />
                    </RadioGroup>
                    <Typography>If Yes? give details </Typography>
                    <TextField variant='filled' size="small" label="type here" disabled={items._39_a && items._39_a.value === 1 ? false : true} value={items._39_a && items._39_a.value === 1 ? items._39_a.specify : ''} onChange={(e) => handleChangeItemText(e.target.value, '_39_a', items._39_a, items, setItems, 1)}></TextField>
                  </FormControl>
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell width={'70%'}>
                <Typography sx={{ color: itemState ? '' : 'lightText.main' }}>
                  40. <br />Pursuant to: (a) Indigenous People's Act (RA 8371); (b) Magna Carta for Disabled Persons (RA 7277); and (c) Solo Parents Welfare Act of 2000 (RA 8972), please
                  <br />
                  a. Are you a member of any indigenous group?
                  <br />
                  b. Are you a person with disability ?
                  <br />
                  c. Are you a solo parent?
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <FormControl
                  >
                    <FormLabel id="radio-40a-group">A</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="radio-40a-group"
                      value={items._40_a && items._40_a.value}
                      name="radio-40a-group"
                    >
                      <FormControlLabel value={1} onClick={(e) => localStorage.getItem('hris_roles') === '1' && pdsParam.id ? '' : handleChangeItem(e.target.value, '_40_a', items._40_a, items, setItems)} control={<Radio />} label="Yes" />
                      <FormControlLabel value={0} onClick={(e) => localStorage.getItem('hris_roles') === '1' && pdsParam.id ? '' : handleChangeItem(e.target.value, '_40_a', items._40_a, items, setItems)} control={<Radio />} label="No" />
                    </RadioGroup>
                    <Typography>If Yes? give details </Typography>
                    <TextField variant='filled' size="small" label="type here" disabled={items._40_a && items._40_a.value === 1 ? false : true} value={items._40_a && items._40_a.value === 1 ? items._40_a.specify : ''} onChange={(e) => handleChangeItemText(e.target.value, '_40_a', items._40_a, items, setItems, 1)}></TextField>
                  </FormControl>
                  <FormControl
                  >
                    <FormLabel id="radio-40b-group">B</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="radio-40b-group"
                      value={items._40_b && items._40_b.value}
                      name="radio-40b-group"
                    >
                      <FormControlLabel value={1} onClick={(e) => localStorage.getItem('hris_roles') === '1' && pdsParam.id ? '' : handleChangeItem(e.target.value, '_40_b', items._40_b, items, setItems)} control={<Radio />} label="Yes" />
                      <FormControlLabel value={0} onClick={(e) => localStorage.getItem('hris_roles') === '1' && pdsParam.id ? '' : handleChangeItem(e.target.value, '_40_b', items._40_b, items, setItems)} control={<Radio />} label="No" />
                    </RadioGroup>
                    <Typography>If Yes? please specify ID No: </Typography>
                    <TextField variant='filled' size="small" label="type here" disabled={items._40_b && items._40_b.value === 1 ? false : true} value={items._40_b && items._40_b.value === 1 ? items._40_b.specify : ''} onChange={(e) => handleChangeItemText(e.target.value, '_40_b', items._40_b, items, setItems, 1)}></TextField>
                  </FormControl>
                  <FormControl
                  >
                    <FormLabel id="radio-40c-group">C</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="radio-40c-group"
                      value={items._40_c && items._40_c.value}
                      name="radio-40c-group"
                    >
                      <FormControlLabel value={1} onClick={(e) => localStorage.getItem('hris_roles') === '1' && pdsParam.id ? '' : handleChangeItem(e.target.value, '_40_c', items._40_c, items, setItems)} control={<Radio />} label="Yes" />
                      <FormControlLabel value={0} onClick={(e) => localStorage.getItem('hris_roles') === '1' && pdsParam.id ? '' : handleChangeItem(e.target.value, '_40_c', items._40_c, items, setItems)} control={<Radio />} label="No" />
                    </RadioGroup>
                    <Typography>If Yes? please specify ID No: </Typography>
                    <TextField variant='filled' size="small" label="type here" disabled={items._40_c && items._40_c.value === 1 ? false : true} value={items._40_c && items._40_c.value === 1 ? items._40_c.specify : ''} onChange={(e) => handleChangeItemText(e.target.value, '_40_c', items._40_c, items, setItems, 1)}></TextField>
                  </FormControl>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant='contained' color="success" sx={{ color: '#fff',borderRadius:'2rem',mt:1 }} onClick={() => handleSubmit(items, defaultItems)}> Submit update</Button>
        </Box>
      )}

    </>
  )
}

export default OtherItems