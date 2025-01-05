import React from 'react';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


import SkillsHobbies from './SkillsHobbies/SkillsHobbies';
import References from './References/References';
import Govid from './Govid/Govid';
const OtherInfo = () => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <Box sx={{ px: { xs: 1, md: 15, lg: 15 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {!matches &&
                <Box>
                    <Typography variant="body1" color="initial" sx={{ p: .5, bgcolor: 'primary.light', color: '#fff', borderRadius: '.2rem' }}> VIII. Other information</Typography>
                </Box>
            }
            <SkillsHobbies />
            <References />
            <Govid />
        </Box>
    );
};

export default OtherInfo;