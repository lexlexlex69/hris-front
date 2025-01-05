import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Av from '../../../../assets/img/avatar.png'
import Typography from '@mui/material/Typography'

const UserInfo = () => {
  const navigate = useNavigate()
  return (
    <Card raised sx={{ flex: 1 }}>
      <CardContent sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, p: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Box sx={{ backgroundImage: `url('${Av}')`, height: 70, width: 70, objectFit: 'cover', backgroundSize: '100% 100%', borderRadius: '100%' }} />
          <Button variant="contained" color="primary" sx={{ borderRadius: '2rem' }} size="small" onClick={() => navigate('applicantPds')}>
            view pds
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="body1" color="primary">First name: {localStorage.getItem('hris_applicant_fname')}</Typography>
          <Typography variant="body1" color="primary">Middle name: {localStorage.getItem('hris_applicant_mname')}</Typography>
          <Typography variant="body1" color="primary">Last name: {localStorage.getItem('hris_applicant_lname')}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserInfo;