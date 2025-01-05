import React from 'react';
import {Skeleton} from '@mui/material'
import Box from '@mui/material/Box'

const SkeletonComponent = () => {
    return (
        <Box sx={{ px: 5, py: 2,display:'flex',flexDirection:'column',gap:2.5 }}>
            <Skeleton width='100%' />
            <Skeleton width='100%' />
            <Skeleton width='100%' />
            <Skeleton width='60%' />
            <Skeleton width='60%' />
            <Skeleton width='50%' />
            <Skeleton width='50%' />
            <Skeleton width='40%' />
            <Skeleton width='40%' />
            <Skeleton width='40%' />
            <Skeleton width='30%' />
            <Skeleton width='30%' />
        </Box>
    );
};

export default SkeletonComponent;