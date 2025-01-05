import React, { useState } from 'react';
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { Tooltip, Typography } from '@mui/material'
import { blue } from '@mui/material/colors';

const style = {
    transform: `translate(0,-50%)`,
    zIndex: 900,
    position: 'fixed',
    top: '50%',
    transition: 'all .2s ease-in-out',
}

const EasyAccess = ({ selected, children,showSelected }) => {
    const [open, setOpen] = useState(false)
    return (
        <Box maxWidth={'10rem'} display='flex' alignItems='center' sx={[style, {
            right: open ? '0rem' : '-7.5rem',
        }]
        }>
            <Tooltip title="Open Actions">
                {open ? (
                    <ArrowForwardIos sx={{ fontSize: 40, color: 'primary.dark', mr: -1, cursor: 'pointer', '&:hover': { color: '#fff' }, transition: 'all .3s', background: `rgba(22, 162, 242, .8)`, p: .8, borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }} onClick={() => setOpen(prev => !prev)} />
                ) : (
                    <ArrowBackIos sx={{ fontSize: 40, color: 'primary.dark', mr: -1, cursor: 'pointer', '&:hover': { color: '#fff' }, transition: 'all .3s', background: `rgba(22, 162, 242, .8)`, p: .8, borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }} onClick={() => setOpen(prev => !prev)} />

                )}
            </Tooltip>
            <Box display='flex' flexDirection='column' boxShadow={`1px 1px 3px ${blue[800]}`} py={2} pl={2} sx={{ borderTopLeftRadius: '1rem', borderBottomLeftRadius: '1rem', background: `rgba(22, 162, 242,1)` }} gap={2} width={'10rem'} minHeight={'10rem'}>
                {showSelected && <Typography variant="body2" color="#fff">Selected: {selected}</Typography>}
                {children}
            </Box>

        </Box>
    );
};

export default EasyAccess;