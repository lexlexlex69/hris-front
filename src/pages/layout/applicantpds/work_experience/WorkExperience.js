import React, { useEffect } from 'react'
import { Box, Card, CardContent, Grid, TextField, Typography, Button, Fab, Fade } from '@mui/material'
import { blue, green, red } from '@mui/material/colors'
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// mui components
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
// mui icons components
import AddIcon from '@mui/icons-material/Add';
import { getEmployees } from '../../../../redux/slice/employeesSlice';
// redux
import { useSelector, useDispatch } from 'react-redux'
import { getPdsWorkExp } from '../../../../redux/slice/pdsWorkExp'

function WorkExperience() {
  // media query
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  // redux
  const dispatch = useDispatch()
  const { workExp } = useSelector(state => state.workExp)
  const workExpRedux = useSelector(state => state.workExp)
  // pagination
  const [page, setPage] = React.useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };
  // functions
  useEffect(() => {
    dispatch(getPdsWorkExp({ id: localStorage.getItem('hris_employee_id') }))
  }, [])
  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: 'flex', gap: 1, flexDirection: 'column', bgcolor: '#fff', p: 1, borderRadius: '.5rem' }} >
        {workExpRedux.loading ? (
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton variant="text" width='40%' />
              <Skeleton variant="text" width='60%' />
            </Box>
            <Skeleton variant="text" width='20%' />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton variant="text" width='60%' />
              <Skeleton variant="text" width='40%' />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton variant="text" width='60%' />
              <Skeleton variant="text" width='40%' />
            </Box>
          </Stack>
        ) : (
          <Fade in>
            <Box>
              <Box sx={{ mb: 1 }}>
                <Button variant='contained' color="success"><AddIcon /> Add record</Button>
              </Box>
              <TableContainer component={Paper} sx={{ maxHeight: '40rem' }}>
                <Table sx={{ minWidth: 650 }} aria-label="work experience table" size="small" stickyHeader>
                  <TableHead color="primary" className="head_primary">
                    <TableRow>
                      <TableCell align="center" sx={{ bgcolor: blue[800] }}>
                        <Typography sx={{ color: '#fff' }} >INCLUSIVE DATES <br /> (mm/dd/yyyy)</Typography>
                        <Table>
                          <TableBody>
                            <TableRow sx={{ display: 'flex', justifyContent: 'space-around' }}>
                              <TableCell align="center" sx={{ color: '#fff' }}><Typography>From</Typography></TableCell>
                              <TableCell align="center" sx={{ color: '#fff' }}><Typography>To</Typography></TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableCell>
                      <TableCell align="center" sx={{ bgcolor: blue[800], color: '#fff' }}><Typography >POSITION TITLE <br /> (Write in full/Do not abbreviate)</Typography></TableCell>
                      <TableCell align="center" sx={{ bgcolor: blue[800], color: '#fff' }}><Typography >DEPARTMENT/AGENCY/OFFICE/COMPANY <br /> (Write in full/Do not abbreviate)</Typography></TableCell>
                      <TableCell align="center" sx={{ bgcolor: blue[800], color: '#fff' }}><Typography >MONTHLY SALARY</Typography></TableCell>
                      <TableCell align="center" sx={{ bgcolor: blue[800], color: '#fff' }}><Typography >SALARY/JOB/PAY GRADE(if applicable) & STEP (Formal*00-0)/INCREMENT</Typography></TableCell>
                      <TableCell align="center" sx={{ bgcolor: blue[800], color: '#fff' }}><Typography >STATUS OF APPOINTMENT</Typography></TableCell>
                      <TableCell align="center" sx={{ bgcolor: blue[800], color: '#fff' }}><Typography >GOV'T SERVICE<br />(Y/N)</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {workExp && workExp.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          <Table>
                            <TableBody>
                              <TableRow sx={{ display: 'flex', justifyContent: 'space-around' }}>
                                <TableCell align="center"><Typography>{item.datefrom}</Typography></TableCell>
                                <TableCell align="center"><Typography>{item.dateto}</Typography></TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableCell>
                        <TableCell align="center">{item.positiontitle}</TableCell>
                        <TableCell align="center">{item.agency}</TableCell>
                        <TableCell align="center">{item.salary}</TableCell>
                        <TableCell align="center">{item.salgrade}</TableCell>
                        <TableCell align="center">{item.status}</TableCell>
                        <TableCell align="center">{item.govt === 1 ? 'Y' : 'N'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Stack spacing={2}>
                  <Typography>Page: {page}</Typography>
                  <Pagination count={10} page={page} onChange={handleChange} />
                </Stack>
            </Box>
          </Fade>
        )}
      </Grid>
    </Grid>
  )
}

export default WorkExperience