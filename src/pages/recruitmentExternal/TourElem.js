import React, { useState } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material'
import CommonModal from '../../common/Modal';
import { blue } from '@mui/material/colors';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';

const TourElem = ({ img, text }) => {

    const [openModal, setOpenModal] = useState(false)
    const handleClose = () => setOpenModal(false)
    return (
        <>
            <Box display='flex' justifyContent='center' alignItems='center' width='100%' position='relative'>
                <CommonModal open={openModal} setOpen={setOpenModal} handleClose={handleClose}>
                    <img src={img} width='100%' height='500px' style={{ objectFit: 'contain' }} />
                </CommonModal>
                <Box width={{ xs: '200px', md: '500px' }}>
                    <Card sx={{ cursor: 'pointer', borderRadius: 5, '&:hover': { bgcolor: `${blue[100]}` }, transition: 'all .3s', mb: 1, width: { xs: '200px', md: '500px' }, zIndex: 10, position: 'relative' }} onClick={() => setOpenModal(true)}>
                        <Box position='absolute' width='100%' height='100%' sx={{ '&:hover': { background: `rgba(179, 179, 179,.7)` }, transition: 'all .3s' }} />
                        <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 5, p: 5 }}>
                <ZoomOutMapIcon sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 15, fontSize: {xs:50,md:50}, color: '#999999' }} />
                            <Box sx={{ height: { xs: '100px', md: '300px' }, width: { xs: '200px', md: '500px' }, display: 'flex', alignItems: 'center' }}>
                                <img src={img} style={{ objectFit: 'contain', backgroundPosition: 'center' }} width='100%' height='auto' />
                            </Box>
                        </CardContent>
                    </Card>
                    <Typography sx={{ color: 'primary.dark' }} variant='body2' align='center'>{text}</Typography>
                </Box>
            </Box>
        </>
    );
};

export default TourElem;