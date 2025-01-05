import React, { useRef, useState } from 'react';
import Slider from "react-slick";
import { Box, Button } from '@mui/material'
import S1 from '../../assets/img/s1.png'
import S2 from '../../assets/img/s2.png'
import S3 from '../../assets/img/s3.png'
import S4 from '../../assets/img/s4.png'
import S5 from '../../assets/img/s5.png'
import CommonModal from '../../common/Modal';
import TourElem from './TourElem';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const QuickTour = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };


    const slickRef = useRef()
    return (
        <Box p={5} position='relative'>
            <div style={{ width: '100%' }}>
                <Slider {...settings} ref={slickRef}>
                    <TourElem img={S1} text="To proceed, select 'REGISTER' in the page's upper right corner." />
                    <TourElem img={S2} text="You'll be taken to the registration page after that. Please complete the form. If you are an outsider or are not a CGB employee, do not check the 'Are you a CGB employee/worker' box." />
                    <TourElem img={S3} text="A verification code will be sent to the email address you provided. Use the verification code by typing it into the form or copying and pasting it." />
                    <TourElem img={S4} text="As your initial engagement with the website for non-CGB employees, we will gather some information that we will use for our 'job applications listing.' Please feel free to submit whatever information you feel is relevant. These will be used in your Personal Data Sheet in the future." />
                    <TourElem img={S5} text="You will be led to the applicants dashboard after inputting your information. Your application's notifications are located in the top section. You will find two options under 'Job Vacancy Positions,' one for viewing the position's specifics and the other for applying. I'm grateful. Thank you" />
                </Slider>
            </div>
            <Box mt={5} display='flex' justifyContent='center' gap={2}>
                <NavigateBeforeIcon sx={{ cursor: 'pointer', fontSize: 35, color: 'primary.main', '&:hover': { color: 'primary.dark' }, transition: 'all .3s' }} onClick={() => slickRef.current.slickPrev()} />
                <NavigateNextIcon sx={{ cursor: 'pointer', fontSize: 35, color: 'primary.main', '&:hover': { color: 'primary.dark' }, transition: 'all .3s' }} onClick={() => slickRef.current.slickNext()} />
                {/* <Button onClick={() => slickRef.current.slickPrev()}>Prev</Button>
                <Button onClick={() => slickRef.current.slickNext()}>Next</Button> */}
            </Box>
        </Box>
    );
};

export default QuickTour;