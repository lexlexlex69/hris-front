import React, { useEffect } from 'react'
import { Box, Card, CardContent, Grid, TextField, Typography, Button, Fab } from '@mui/material'
import { blue, green, red } from '@mui/material/colors'
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function ChildrenModal() {
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <Box>
            <Typography sx={{ bgcolor: blue[500], color: '#fff', p: 1, mb: 1 }}>ADD CHILD RECORD</Typography>
            <Box sx={{ display: 'flex', gap: 1,flexDirection: matches ? 'column' : 'row' }}>
                <TextField label='Child Name' fullWidth />
                <TextField label='Date of Birth' fullWidth />
                <Button variant="contained">Add</Button>
            </Box>
        </Box>
    )
}

export default ChildrenModal