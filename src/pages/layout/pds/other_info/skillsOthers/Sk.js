import React from 'react'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

function Sk() {
    return (
            <Stack spacing={1}>
                <Skeleton variant="text"  width="20%" />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="70%" />
                <Skeleton variant="text" width="70%" />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="80%" />

            </Stack>
    )
}

export default Sk