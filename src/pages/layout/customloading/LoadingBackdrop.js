import React, { useState, useEffect } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography'

const LoadingBackdrop = ({ title, open, textColor }) => {
    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 ,display:'flex',flexDirection:'column',gap:1})}
            open={open}
        >
            <CircularProgress color="inherit" />
            <Typography variant="body1" sx={{ color: textColor ? textColor : '' }}> {title}</Typography>
        </Backdrop>
    );
};

export default LoadingBackdrop;