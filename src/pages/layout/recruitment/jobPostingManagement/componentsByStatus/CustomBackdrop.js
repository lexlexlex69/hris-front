import React, { useState, useEffect } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography'

const CustomBackdrop = ({ title, open, textColor,sx }) => {
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute', display: 'flex', flexDirection: 'column',sx }}
            open={open}
        >
            <CircularProgress color="inherit" />
            <Typography variant="body1" sx={{ color: textColor ? textColor : '' }}> {title}</Typography>
        </Backdrop>
    );
};

export default CustomBackdrop;