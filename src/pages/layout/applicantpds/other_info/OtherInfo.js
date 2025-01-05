import React, { useEffect, useState } from 'react'
import { Box, Card, CardContent, Grid, TextField, Typography, Button, Fab, Modal, Backdrop, Fade } from '@mui/material'
import { blue, green, red } from '@mui/material/colors'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
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

function OtherInfo() {
  // media query
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  // redux
  const dispatch = useDispatch()
  const { others } = useSelector(state => state.others)
  const othersRedux = useSelector(state => state.others)

  // 
  useEffect(() => {
    // if(Object.keys(others).length === 0){
    dispatch(getPdsOthers({ id: localStorage.getItem('hris_employee_id') }))
    // }
  }, [dispatch])
  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: 'flex', gap: 3, flexDirection: 'column', bgcolor: '#fff', p: 2, borderRadius: '.5rem' }} >
        {othersRedux.loading ? (
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
              <Box>
                <Box sx={{ display: 'flex', gap: 1, flexDirection: matches ? 'column' : 'row' }}>
                  <TableContainer component={Paper} sx={{ mb: 1 }}>
                    <Table aria-label="children table" size="small">
                      <TableHead sx={{ bgcolor: blue[800] }}>
                        <TableRow>
                          <TableCell width={'50%'} align="center"><Typography sx={{ color: '#fff' }}>SPECIAL SKILLS and HOBBIES</Typography></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {others.ss && others.ss.map((item, index) => (
                          <TableRow>
                            <TableCell>
                              {item.description}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TableContainer component={Paper} sx={{ mb: 1 }}>
                    <Table aria-label="children table" size="small">
                      <TableHead sx={{ bgcolor: blue[800] }}>
                        <TableRow>
                          <TableCell width={'50%'} align="center"><Typography sx={{ color: '#fff' }}>NON-ACADEMIC DISTINCTIONS/RECOGNITION <br />write in full</Typography></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {others.recognition && others.recognition.map((item, index) => (
                          <TableRow>
                            <TableCell>
                              {item.description}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TableContainer component={Paper} sx={{ mb: 1 }}>
                    <Table aria-label="children table" size="small">
                      <TableHead sx={{ bgcolor: blue[800] }}>
                        <TableRow>
                          <TableCell width={'50%'} align="left"><Typography sx={{ color: '#fff' }}>MEMBERSHIP IN ASSOCIATION/ORGANIZATION</Typography></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {others.organization && others.organization.map((item, index) => (
                          <TableRow>
                            <TableCell>
                              {item.description}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
                <TableContainer component={Paper} sx={{ mb: 1 }}>
                  <Table aria-label="children table" size="small">
                    {/* <TableHead sx={{ bgcolor: blue[800] }}>
                      <TableRow>
                        <TableCell width={'50%'} align="left"><Typography sx={{ color: '#fff' }}>MEMBERSHIP IN ASSOCIATION/ORGANIZATION</Typography></TableCell>
                          <TableCell width={'50%'} align="center"><Typography sx={{ color: '#fff' }}></Typography></TableCell>
                      </TableRow>
                    </TableHead> */}
                    <TableBody>
                      <TableRow>
                        <TableCell width={'70%'}>
                          <Typography>
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
                                defaultValue="45"
                                name="radio-34a-group"
                              >
                                <FormControlLabel value="YES" control={<Radio />} label="Yes" />
                                <FormControlLabel value="No" control={<Radio />} label="No" />
                              </RadioGroup>
                            </FormControl>
                            <FormControl
                            >
                              <FormLabel id="radio-34b-group">B</FormLabel>
                              <RadioGroup
                                row
                                aria-labelledby="radio-34b-group"
                                defaultValue="45"
                                name="radio-34b-group"
                              >
                                <FormControlLabel value="YES" control={<Radio />} label="Yes" />
                                <FormControlLabel value="No" control={<Radio />} label="No" />
                              </RadioGroup>
                              <Typography>If Yes? give details </Typography>
                              <TextField variant='filled' size="small" label="type here"></TextField>
                            </FormControl>
                          </Box>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell width={'70%'}>
                          <Typography>
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
                                defaultValue="45"
                                name="radio-34a-group"
                              >
                                <FormControlLabel value="YES" control={<Radio />} label="Yes" />
                                <FormControlLabel value="No" control={<Radio />} label="No" />
                              </RadioGroup>
                              <Typography>If Yes? give details: <br /> Date Filed: </Typography>
                              <TextField variant='filled' size="small" label="type here"></TextField>
                              <Typography>Status of Case/s: </Typography>
                              <TextField variant='filled' size="small" label="type here"></TextField>
                            </FormControl>
                            <FormControl
                            >
                              <FormLabel id="radio-34b-group">B</FormLabel>
                              <RadioGroup
                                row
                                aria-labelledby="radio-34b-group"
                                defaultValue="45"
                                name="radio-34b-group"
                              >
                                <FormControlLabel value="YES" control={<Radio />} label="Yes" />
                                <FormControlLabel value="No" control={<Radio />} label="No" />
                              </RadioGroup>
                              <Typography>If Yes? give details </Typography>
                              <TextField variant='filled' size="small" label="type here"></TextField>
                            </FormControl>
                          </Box>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell width={'70%'}>
                          <Typography>
                            36. <br /> Have you ever been convicted of any crime or violation of any law,decree,ordinance or regulation by  any court tribunal?
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <FormControl
                            >
                              <FormLabel id="radio-34a-group"></FormLabel>
                              <RadioGroup
                                row
                                aria-labelledby="radio-34a-group"
                                defaultValue="45"
                                name="radio-34a-group"
                              >
                                <FormControlLabel value="YES" control={<Radio />} label="Yes" />
                                <FormControlLabel value="No" control={<Radio />} label="No" />
                              </RadioGroup>
                              <Typography>If Yes? give details </Typography>
                              <TextField variant='filled' size="small" label="type here"></TextField>
                            </FormControl>
                          </Box>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell width={'70%'}>
                          <Typography>
                            37. <br /> Have you ever been separated from the service in any of the following modes: resignation,retirement,dropped from the rolls, dismissal,termination,end of term,finished contact or phased out (abolition) in public or private sector?
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <FormControl
                            >
                              <FormLabel id="radio-34a-group"></FormLabel>
                              <RadioGroup
                                row
                                aria-labelledby="radio-34a-group"
                                defaultValue="45"
                                name="radio-34a-group"
                              >
                                <FormControlLabel value="YES" control={<Radio />} label="Yes" />
                                <FormControlLabel value="No" control={<Radio />} label="No" />
                              </RadioGroup>
                              <Typography>If Yes? give details </Typography>
                              <TextField variant='filled' size="small" label="type here"></TextField>
                            </FormControl>
                          </Box>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell width={'70%'}>
                          <Typography>
                            38. <br />a. Have you ever been a candidate in a national or local election held within the last year (except Barangay election)?

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
                                defaultValue="45"
                                name="radio-34a-group"
                              >
                                <FormControlLabel value="YES" control={<Radio />} label="Yes" />
                                <FormControlLabel value="No" control={<Radio />} label="No" />
                              </RadioGroup>
                              <Typography>If Yes? give details </Typography>
                              <TextField variant='filled' size="small" label="type here"></TextField>
                            </FormControl>
                            <FormControl
                            >
                              <FormLabel id="radio-34b-group">B</FormLabel>
                              <RadioGroup
                                row
                                aria-labelledby="radio-34b-group"
                                defaultValue="45"
                                name="radio-34b-group"
                              >
                                <FormControlLabel value="YES" control={<Radio />} label="Yes" />
                                <FormControlLabel value="No" control={<Radio />} label="No" />
                              </RadioGroup>
                              <Typography>If Yes? give details </Typography>
                              <TextField variant='filled' size="small" label="type here"></TextField>
                            </FormControl>
                          </Box>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell width={'70%'}>
                          <Typography>
                            39. <br /> Have you acquired the status of an immigrant or permanent resident of another country?
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <FormControl
                            >
                              <FormLabel id="radio-34a-group"></FormLabel>
                              <RadioGroup
                                row
                                aria-labelledby="radio-34a-group"
                                defaultValue="45"
                                name="radio-34a-group"
                              >
                                <FormControlLabel value="YES" control={<Radio />} label="Yes" />
                                <FormControlLabel value="No" control={<Radio />} label="No" />
                              </RadioGroup>
                              <Typography>If Yes? give details </Typography>
                              <TextField variant='filled' size="small" label="type here"></TextField>
                            </FormControl>
                          </Box>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell width={'70%'}>
                          <Typography>
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
                              <FormLabel id="radio-34a-group">A</FormLabel>
                              <RadioGroup
                                row
                                aria-labelledby="radio-34a-group"
                                defaultValue="45"
                                name="radio-34a-group"
                              >
                                <FormControlLabel value="YES" control={<Radio />} label="Yes" />
                                <FormControlLabel value="No" control={<Radio />} label="No" />
                              </RadioGroup>
                              <Typography>If Yes? give details </Typography>
                              <TextField variant='filled' size="small" label="type here"></TextField>
                            </FormControl>
                            <FormControl
                            >
                              <FormLabel id="radio-34b-group">B</FormLabel>
                              <RadioGroup
                                row
                                aria-labelledby="radio-34b-group"
                                defaultValue="45"
                                name="radio-34b-group"
                              >
                                <FormControlLabel value="YES" control={<Radio />} label="Yes" />
                                <FormControlLabel value="No" control={<Radio />} label="No" />
                              </RadioGroup>
                              <Typography>If Yes? please specify ID No: </Typography>
                              <TextField variant='filled' size="small" label="type here"></TextField>
                            </FormControl>
                            <FormControl
                            >
                              <FormLabel id="radio-34b-group">C</FormLabel>
                              <RadioGroup
                                row
                                aria-labelledby="radio-34b-group"
                                defaultValue="45"
                                name="radio-34b-group"
                              >
                                <FormControlLabel value="YES" control={<Radio />} label="Yes" />
                                <FormControlLabel value="No" control={<Radio />} label="No" />
                              </RadioGroup>
                              <Typography>If Yes? please specify ID No: </Typography>
                              <TextField variant='filled' size="small" label="type here"></TextField>
                            </FormControl>
                          </Box>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </Fade>
        )}
      </Grid>
    </Grid>
  )
}

export default OtherInfo