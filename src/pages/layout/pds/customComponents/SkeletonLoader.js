import React from 'react'
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box'

function SkeletonLoader() {
  return (
    <Stack spacing={3}>
            <Skeleton variant="text" width='20%' />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton variant="text" width='40%' />
              <Skeleton variant="text" width='60%' />
            </Box>
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton variant="text" width='60%' />
              <Skeleton variant="text" width='40%' />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton variant="text" width='60%' />
              <Skeleton variant="text" width='40%' />
            </Box>
            <Skeleton variant="text" />
            <Skeleton variant="text" />
          </Stack>
  )
}

export default SkeletonLoader