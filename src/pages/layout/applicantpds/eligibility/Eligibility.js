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
// mui icons components
import AddIcon from '@mui/icons-material/Add';
// redux
import { useDispatch, useSelector } from 'react-redux'
import { getPdsEligibility } from '../../../../redux/slice/pdsEligibility'


function Eligibility() {
  // redux
  const dispatch = useDispatch()
  const { eligibility } = useSelector(state => state.eligibility)
  const elegibilityRedux = useSelector(state => state.eligibility)

  // media query
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    dispatch(getPdsEligibility({ id: localStorage.getItem('hris_employee_id') }))
    console.log(eligibility)
  }, [dispatch])
  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: 'flex', gap: 1, flexDirection: 'column', bgcolor: '#fff', p: 1, borderRadius: '.5rem' }} >

        {elegibilityRedux.loading ? (
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton variant="text" width='40%' />
              <Skeleton variant="text" width='60%' />
            </Box>
            <Skeleton variant="text" width='20%' />
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
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead sx={{ bgcolor: blue[800] }}>
                    <TableRow>
                      <TableCell align="center"><Typography sx={{ color: '#fff' }}>CAREER SERVICE/RA 1080 (BOARD/BAR/) UNDER SPECIAL LAW/CES/CSEE BARANGAY ELIGIBILITY/DRIVER'S LICENSE</Typography></TableCell>
                      <TableCell align="center"><Typography sx={{ color: '#fff' }}>RATING <br /> (if applicable)</Typography></TableCell>
                      <TableCell align="center"><Typography sx={{ color: '#fff' }}>DATE of EXAMINATION / CONFERMENT</Typography></TableCell>
                      <TableCell align="center"><Typography sx={{ color: '#fff' }}>PLACE OF EXAMINATION</Typography></TableCell>
                      <TableCell align="center">
                        <Typography sx={{ color: '#fff' }}>LICENSE (If applicable)</Typography>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell>
                              <Typography sx={{ color: '#fff' }}>Number</Typography>
                              </TableCell>
                              <TableCell>
                              <Typography sx={{ color: '#fff' }}>Date of validity</Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {eligibility && eligibility.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {item.title}
                        </TableCell>
                        <TableCell align="center">{item.rating}</TableCell>
                        <TableCell align="center">{item.dateofexam}</TableCell>
                        <TableCell align="center">{item.placeofexam}</TableCell>
                        <TableCell align="center">
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell align="center">
                              <Typography>{item.licenseno}</Typography>
                              </TableCell>
                              <TableCell align="center">
                              <Typography>{item.dateissue}</Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Fade>
        )}
      </Grid>
    </Grid>
  )
}

export default Eligibility