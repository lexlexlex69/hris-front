import React,{useEffect} from 'react'
import { Box, Card, CardContent, Grid, TextField, Typography, Button, Fab } from '@mui/material'
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
// mui icons components
import AddIcon from '@mui/icons-material/Add';
// redux
import {useDispatch,useSelector} from 'react-redux'
import {getPdsTrainings} from '../../../../redux/slice/pdsTrainings'

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Civil Service Subprof Eligibility', 'ASNHS', 'ELEM GRAD.', '1993', '1999'),
  createData('SECONDARY', 'ASNHS', 'ELEM GRAD.', '1993', '1999'),
  createData('VOCATIONAL', 'ASNHS', 'ELEM GRAD.', '1993', '1999'),
];

function Certificates() {
  // redux
  const dispatch = useDispatch()
  const {trainings} = useSelector(state => state.trainings)
  // media query
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  useEffect(() => {
    dispatch(getPdsTrainings({id:localStorage.getItem('hris_employee_id')}))
  },[])
  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: 'flex', gap: 1, flexDirection: 'column', bgcolor: '#fff', p: 1, borderRadius: '.5rem' }} >
        <Box>
        <Button variant='contained' color="success"><AddIcon/> Add record</Button>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{bgcolor:blue[800]}}>
              <TableRow>
                <TableCell align="center"><Typography sx={{color:'#fff'}}>TITLE OF LEARNING AND DEVELOPMENT INTERVENTIONS/TRAINING PROGRAMS <br/> (write in full)</Typography></TableCell>
                <TableCell align="center"><Typography sx={{color:'#fff'}}>INCLUSIVE DATES OF ATTENDANCE <br/> (mm/dd/yyyy)</Typography>
                  <Table>
                    <TableRow>
                      <TableCell><Typography sx={{color:'#fff'}}>From</Typography></TableCell>
                      <TableCell><Typography sx={{color:'#fff'}}>To</Typography></TableCell>
                    </TableRow>
                  </Table>
                </TableCell>
                <TableCell align="center"><Typography sx={{color:'#fff'}}>NUMBER OF HOURS</Typography></TableCell>
                <TableCell align="center"><Typography sx={{color:'#fff'}}>Type of LD <br/>Managerial/Supervisory/Technical/etc</Typography></TableCell>
                <TableCell align="center"><Typography sx={{color:'#fff'}}>CONDUCTED/SPONSORED BY <br/> (write in full)</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trainings && trainings.map((item,index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align="center">
                    {item.title}
                  </TableCell>
                  <TableCell align="center">
                    <Table>
                      <TableRow>
                        <TableCell>
                        {item.datefrom}
                        </TableCell>
                        <TableCell>
                        {item.dateto}
                        </TableCell>
                      </TableRow>
                    </Table>
                  </TableCell>
                  <TableCell align="center">{item.nohours}</TableCell>
                  <TableCell align="center">{item.typeLD}</TableCell>
                  <TableCell align="center">{item.conducted}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}

export default Certificates