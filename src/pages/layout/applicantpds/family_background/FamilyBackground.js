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
import ChildrenModal from './ChildrenModal';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { getPdsFamilyBackground } from '../../../../redux/slice/pdsFamilyBackground';
// mui components
import AddIcon from '@mui/icons-material/Add';

function FamilyBackground() {
  // media query
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  // redux
  const dispatch = useDispatch()
  const routeParam = useSelector(state => state.routeParam)
  const { familyBackground } = useSelector(state => state.family)
  const family = useSelector(state => state.family)

  // modal
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: matches ? '80%' : '40%',
    bgcolor: 'background.paper',
    borderRadius: '1rem',
    boxShadow: 24,
    p: 4,
  };
  const [openChildrenModal, setOpenChildrenModal] = useState(false);
  const handleOpenChildrenModal = () => setOpenChildrenModal(true);
  const handleCloseChildrenModal = () => setOpenChildrenModal(false);

  // 
  useEffect(() => {
    if(routeParam)
    {
      dispatch(getPdsFamilyBackground({ id: routeParam}))
    }
    else {
      if(Object.keys(familyBackground).length === 0){
        dispatch(getPdsFamilyBackground({ id: Number(localStorage.getItem('hris_employee_id'))}))
      }
    }
   
  }, [dispatch])
  return (
    <Grid container>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openChildrenModal}
        onClose={handleCloseChildrenModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openChildrenModal}>
          <Box sx={style}>
            <ChildrenModal />
          </Box>
        </Fade>
      </Modal>
      <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: 'flex', gap: 3, flexDirection: 'column', bgcolor: '#fff', p: 2, borderRadius: '.5rem' }} >
        {family.loading ? (
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
            <Box sx={{ display: 'flex', gap: 1, flexDirection: matches ? 'column' : 'row' }}>
              <TextField label="SPOUSE'S SURNAME" fullWidth size="small" value={familyBackground.spouse_surname} focused />
              <TextField label="FIRST NAME" size="small" fullWidth value={familyBackground.spouse_fname} focused />
              <TextField label="MIDDLENAME" size="small" fullWidth value={familyBackground.spouse_mname} focused />
              <TextField label="Name Extension" size="small" fullWidth value={familyBackground.spouse_extn} focused />
            </Box>
            <Box>
              <Button variant="contained" sx={{ my: 1 }} color="success" onClick={handleOpenChildrenModal}><AddIcon /> add children</Button>
              <Box sx={{ display: 'flex', gap: 1, flexDirection: matches ? 'column' : 'row' }}>
                <TableContainer component={Paper} sx={{mb:1}}>
                  <Table sx={{ minWidth: 650 }} aria-label="children table" size="small">
                    <caption>List of children</caption>
                    <TableHead sx={{ bgcolor: blue[800] }}>
                      <TableRow>
                        <TableCell width={'50%'} align="center"><Typography sx={{color:'#fff'}}>CHILD NAME</Typography></TableCell>
                        <TableCell width={'50%'} align="center"><Typography sx={{color:'#fff'}}>DATE OF BIRTH</Typography></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {familyBackground.children && familyBackground.children.map((item, index) => (
                        <TableRow
                          key={index}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row" align="center">
                            {item.child_name}
                          </TableCell>
                          <TableCell align="center">{item.dob}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
            <Box>
              <Typography sx={{ pl: 1 }}><b>Father's Information</b></Typography>
              <Box sx={{ display: 'flex', gap: 1, flexDirection: matches ? 'column' : 'row' }}>
                <TextField label="SURNAME" size="small" fullWidth value={familyBackground.father_surname} focused />
                <TextField label="FIRSTNAME" size="small" fullWidth value={familyBackground.father_fname} focused />
                <TextField label="MIDDLENAME" size="small" fullWidth value={familyBackground.father_mname} focused />
                <TextField label="EXTENSION" size="small" fullWidth value={familyBackground.father_extn} focused />
              </Box>
            </Box>
            <Box>
              <Typography sx={{ pl: 1 }}><b>Mother's Information</b></Typography>
              <Box sx={{ display: 'flex', gap: 1, flexDirection: matches ? 'column' : 'row' }}>
                <TextField label="MOTHER'S MAIDEN" size="small" fullWidth value={familyBackground.mother_maiden} focused />
                <TextField label="SURNAME" size="small" fullWidth value={familyBackground.mother_surname} focused />
                <TextField label="FIRSTNAME" size="small" fullWidth value={familyBackground.mother_fname} focused />
                <TextField label="MIDDLENAME" size="small" fullWidth value={familyBackground.mother_mname} focused />
                <TextField label="EXTENSION" size="small" fullWidth value={familyBackground.mother_extn} focused />
                <TextField label="STATUS" size="small" fullWidth focused />
              </Box>
            </Box>
          </Box>
          </Fade>
        )}
      </Grid>
    </Grid>
  )
}

export default FamilyBackground