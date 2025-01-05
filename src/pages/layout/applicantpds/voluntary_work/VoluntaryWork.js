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
import {getPdsVoluntary} from '../../../../redux/slice/pdsVoluntarty'

function VoluntaryWork() {
  // redux
  const dispatch = useDispatch()
  const {voluntary} = useSelector(state => state.voluntary)
  const voluntaryRedux = useSelector(state => state.voluntary)

  // media query
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    dispatch(getPdsVoluntary({id:localStorage.getItem('hris_employee_id')}))
  },[])
  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: 'flex', gap: 1, flexDirection: 'column', bgcolor: blue[100], p: 1, borderRadius: '.5rem' }} >
        <Box>
        <Button variant='contained' color="success"><AddIcon/> Add record</Button>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{bgcolor:blue[800]}}>
              <TableRow>
                <TableCell align="center"><Typography sx={{color:'#fff'}}>NAME AND ADDRESS OF ORGANIZATION</Typography></TableCell>
                <TableCell align="center"><Typography sx={{color:'#fff'}}>INCLUSIVE DATES <br/> (mm/dd/yyyy)</Typography>
                  <Table>
                    <TableRow>
                      <TableCell sx={{color:'#fff'}}>From</TableCell>
                      <TableCell sx={{color:'#fff'}}>To</TableCell>
                    </TableRow>
                  </Table>
                </TableCell>
                <TableCell align="center"><Typography sx={{color:'#fff'}}>NUMBER OF HOURS</Typography></TableCell>
                <TableCell align="center"><Typography sx={{color:'#fff'}}>POSITION / NATURE OF WORK</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {voluntary && voluntary.map((item,index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {item.organization}
                  </TableCell>
                  <TableCell align="center">
                  <Table>
                    <TableRow>
                      <TableCell >{item.datefrom}</TableCell>
                      <TableCell >{item.dateto}</TableCell>
                    </TableRow>
                  </Table>
                  </TableCell>
                  <TableCell align="center">{item.nohrs}</TableCell>
                  <TableCell align="center">{item.positionwork}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}

export default VoluntaryWork