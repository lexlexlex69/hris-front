import React, { useEffect } from 'react';
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

const EasyAccessCards = ({ icon, onClick,title,shortText }) => {
    return (
        <Box onClick={onClick} sx={{'&:hover':{bgcolor:`primary.main`},px:.5,transition:'all .3s',cursor:'pointer',borderTopLeftRadius:5,borderBottomLeftRadius:5}}>
            <Tooltip title={title}>
               {icon}
            </Tooltip>
            <Typography variant="body2" color="#fff">{shortText}</Typography>
        </Box>
    );
};

export default EasyAccessCards;