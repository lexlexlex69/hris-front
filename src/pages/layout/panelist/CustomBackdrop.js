import React, { useState, useEffect } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

const CustomBackdrop = ({ title, open }) => {
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute', display: 'flex', flexDirection: 'column' }}
            open={open}
        >
            <CircularProgress color="inherit" />
            {title}
        </Backdrop>
    );
};

export default CustomBackdrop;