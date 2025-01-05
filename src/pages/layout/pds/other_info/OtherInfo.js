import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { blue, green, red } from '@mui/material/colors'
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
import Skeleton from '@mui/material/Skeleton';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { getPdsOthers } from '../../../../redux/slice/pdsOthers';
// mui components
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

// external import
import SkeletonLoader from '../customComponents/SkeletonLoader';
import References from './references/References';
import Gid from './gid/Gid';
import Esig from './esig/Esig';
import OtherItems from './34_40/OtherItems';
import SkillsOthers from './skillsOthers/SkillsOthers';
// external import functions
import { getEmployeeOthers } from './Controller'

function OtherInfo() {
  // pdsParam
  const pdsParam = useParams()
  // media query
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  // redux
  // const dispatch = useDispatch()
  // const { others } = useSelector(state => state.others)
  // const othersRedux = useSelector(state => state.others)

  // components state
  const [others, setOthers] = useState([])
  const [show34To40, setShow34To40] = useState(false)
  // pagination
  const [pageTotal, setPageTotal] = useState(0)
  const [tableData, setTableData] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)


  // useEffect(() => {
  //   const controller = new AbortController()
  //   if (pdsParam.id && localStorage.getItem('hris_roles') === '1') {
  //     getEmployeeOthers(pdsParam.id, setOthers, controller, setPageTotal, setTableData)
  //   }
  //   else {
  //     getEmployeeOthers('', setOthers, controller, setPageTotal, setTableData)
  //   }

  //   // clean up
  //   return () => {
  //     controller.abort()
  //   }
  // }, [])
  return (
    <Grid container sx={{px:matches ? 0: 20}}>
      <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: 'flex', gap: 3, flexDirection: 'column', bgcolor: '#fff', borderRadius: '.5rem' }} >
        {others.loading ? (
          <SkeletonLoader />
        ) : (
          <Fade in>
            <Box>
              <Box>
                <Box>
                  {/* <TableContainer component={Paper} sx={{ maxHeight: '33rem', mb: 1, height: '33rem' }}>
                    <Table aria-label="children table" size="small" stickyHeader>
                      <TableHead sx={{ bgcolor: blue[800] }}>
                        <TableRow>
                          <TableCell className='cgb-color-table' width={'50%'} align="center"><Typography className='table-font-size' sx={{ color: '#fff' }}>SPECIAL SKILLS and HOBBIES</Typography></TableCell>
                          <TableCell className='cgb-color-table' width={'50%'} align="center"><Typography className='table-font-size' sx={{ color: '#fff' }}>NON-ACADEMIC DISTINCTIONS/RECOGNITION <br />write in full</Typography></TableCell>
                          <TableCell className='cgb-color-table' width={'50%'} align="left"><Typography className='table-font-size' sx={{ color: '#fff' }}>MEMBERSHIP IN ASSOCIATION/ORGANIZATION</Typography></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {others.length !== 0 ? (
                          <>
                            {others.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  {item.description}
                                </TableCell>
                                <TableCell>
                                  {item.typeid}
                                </TableCell>
                                <TableCell>
                                  {
                                    [1, 2, 6].map((item, index2) => (
                                      <div key={index2}>
                                        <Typography >sample {item}</Typography>
                                      </div>
                                    ))
                                  }
                                </TableCell>
                              </TableRow>
                            ))}
                          </>

                        ) : (
                          <>
                            <TableRow >
                              <TableCell sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Skeleton variant='text' width="100%" sx={{ heigth: '10px' }}></Skeleton>
                              </TableCell>
                              <TableCell>
                                <Skeleton variant='text' width="80%" sx={{ heigth: '10px' }}></Skeleton>
                              </TableCell>
                              <TableCell>
                                <Skeleton variant='text' width="70%" sx={{ heigth: '10px' }}></Skeleton>
                              </TableCell>
                            </TableRow>
                            <TableRow >
                              <TableCell sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Skeleton variant='text' width="80%" sx={{ heigth: '10px' }}></Skeleton>
                              </TableCell>
                              <TableCell>
                                <Skeleton variant='text' width="100%" sx={{ heigth: '10px' }}></Skeleton>
                              </TableCell>
                              <TableCell>
                                <Skeleton variant='text' width="90%" sx={{ heigth: '10px' }}></Skeleton>
                              </TableCell>
                            </TableRow>
                            <TableRow >
                              <TableCell sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Skeleton variant='text' width="100%" sx={{ heigth: '10px' }}></Skeleton>
                              </TableCell>
                              <TableCell>
                                <Skeleton variant='text' width="60%" sx={{ heigth: '10px' }}></Skeleton>
                              </TableCell>
                              <TableCell>
                                <Skeleton variant='text' width="100%" sx={{ heigth: '10px' }}></Skeleton>
                              </TableCell>
                            </TableRow>
                          </>
                        )}

                      </TableBody>
                    </Table>
                  </TableContainer> */}
                  {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button variant='contained' color="success" sx={{ color: '#fff', mb: 2 }}><EditIcon /> &nbsp; Submit update</Button>
                  </Box> */}
              {!matches && <Typography variant="body2" color="#fff" sx={{ bgcolor: 'primary.main', p: .5, px: 1, borderRadius: .5, mb: 1 }}>OTHER INFORMATION</Typography>}
                  <SkillsOthers/>
                </Box>
                <Box sx={{ display: 'flex', px: 1, color: '#fff', mt: 1, bgcolor: '#62757f' }}>
                  <FormGroup>
                    <FormControlLabel control={<Checkbox checked={show34To40} />} label="show items 34- 40 " onChange={() => setShow34To40(!show34To40)} />
                  </FormGroup>
                </Box>
                {show34To40 ? (
                  <Fade in>
                    <div>
                      <OtherItems />
                    </div>
                  </Fade>
                ) : null}
              </Box>
            </Box>
          </Fade>
        )}
        <hr />
        <References />
        <Gid />
        {/* <Esig /> */}
      </Grid>
    </Grid >
  )
}

export default OtherInfo