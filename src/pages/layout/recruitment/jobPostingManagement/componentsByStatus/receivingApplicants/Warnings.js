import React from 'react';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const Warnings = ({ arr }) => {
    return (
        <Box sx={{display:'flex',flexDirection:{xs:'column',md:'row'}}} >
            {arr.length > 0 && arr.map((item, index) => (
                <Box display='flex' key={index} sx={{ mr: 1 }}>
                    <Box sx={{ height: 15, width: 15, bgcolor: item.color, mr: 1 }}></Box>
                    <Typography variant="body2" sx={{ color:'#3D3D3D' }}>{item.text}</Typography>
                </Box>
            ))}

        </Box>
    );
};

export default Warnings;