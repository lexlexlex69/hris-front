import { Box, Typography } from '@mui/material';
import React from 'react';

function UnderDevelopmentMenu({children}){
    return(
        <div sx={{ position: 'relative' }}>
            <Typography sx={{bgcolor:'red',color:'white',fontSize:'.8rem',textAlign:'center'}}>Under Development</Typography>
            {children}
        </div>
    )
}
export default UnderDevelopmentMenu