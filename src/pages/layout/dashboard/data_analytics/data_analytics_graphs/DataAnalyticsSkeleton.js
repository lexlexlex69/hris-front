import React from 'react'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'

function DataAnalyticsSkeleton() {
    return (
        <Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                        <Skeleton width="100%" height="20rem" variant='rectangular' sx={{ bgcolor: '#EBEBEB' }} />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1, gap: 2, flex: 1 }}>
                        {Array.from(Array(7)).map((item, index) => (
                            <Box key={index}>
                                <Skeleton width="100%" height="2rem" sx={{ bgcolor: '#EBEBEB'  }} />
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
            <Box display="" mx="" my="2rem" sx="">
            <Skeleton width="100%" height="2rem" sx={{ bgcolor: '#EBEBEB'  }} />
            <Skeleton width="100%" height="2rem" sx={{ bgcolor: '#EBEBEB'  }} />
            </Box>
         
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1, gap: 2 }}>
                {Array.from(Array(4)).map((item, index) => (
                    <Box sx={{ display: 'flex', gap: 2 }} key={index}>
                        {Array.from(Array(5)).map((x,i) => (
                        <Skeleton width="20%" key={i} height="2rem" sx={{ bgcolor: '#EBEBEB'  }} />
                        ))}
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

export default DataAnalyticsSkeleton