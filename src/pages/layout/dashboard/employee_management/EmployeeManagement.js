import React, { useEffect, useRef, useState } from 'react'
import { Grid, Box, Card, CardContent, Typography, TextField, Button, Fab, Tooltip, CircularProgress } from '@mui/material'
import {
    Link,
    useNavigate
} from "react-router-dom";
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { blue, green, red } from '@mui/material/colors'
// odometer for dashboard cards figures animation
import { useSpring, animated } from 'react-spring'
// mui icons
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// 
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EmployeeCard from './EmployeeCard';
import axios from 'axios';
// images 
import Av from '../../../../assets/img/avatar.png'
// redux
import { useDispatch, useSelector } from 'react-redux';
// import { getEmployees } from '../../../../redux/slice/employeesSlice'
import { employeeRouteParamCall } from '../../../../redux/slice/employeeRouteParam';

import { getEmployeesSlider, handleNext, handlePrev, handleSearch, handleNavigate, handleNavigateMain } from './Controller'
import { Person } from '@mui/icons-material';

const EmployeeManagement = () => {
    // react-slick

    const [activeSlide, setActiveSlide] = useState(0)
    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <ArrowForwardIosIcon
                className={className}
                style={{ ...style, display: "block", color: loader ? 'gray' : blue[500], pointerEvents: loader ? 'none' : '' }}
                onClick={onClick}
            />
        );
    }

    function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <ArrowBackIosIcon
                className={className}
                style={{ ...style, display: "block", color: blue[500] }}
                onClick={onClick}
            />
        );
    }

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        arrows: true,
        dots: false,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        afterChange: current => setActiveSlide(current),
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    initialSlide: 0,
                    slidesToScroll: 4,
                    infinite: false,
                    dots: false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 0
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 0
                }
            }
        ]
    };
    // navigation
    const firstRenderRef = useRef(true)
    const firstRenderRef2 = useRef(true)
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    // redux
    const dispatch = useDispatch()
    const [num, setNum] = useState(1)
    const [employees, setEmployees] = useState([])
    const [loader, setLoader] = useState(false)
    const [name, setName] = useState('')
    const [perPage, setPerPage] = useState(10)
    const [page, setPage] = useState(1)
    const [offset, setOffset] = useState(1)
    const limit = 10
    const [total, setTotal] = useState(0)


    const handleSearchEmployee = async () => {
        getEmployeesSlider(setEmployees, employees, setLoader, perPage, page, offset, limit, setTotal, name)
    }

    useEffect(() => {
        if (firstRenderRef.current) {
            console.log('active')
            getEmployeesSlider(setEmployees, employees, setLoader, perPage, page, offset, limit, setTotal, name)
            firstRenderRef.current = false
        }
        else {
            if (activeSlide >= total - 4) {
                setOffset(prev => prev + 1)
            }
        }

    }, [activeSlide])
    useEffect(() => {
        if (firstRenderRef2.current) {
            firstRenderRef2.current = false
        }
        else {
            getEmployeesSlider(setEmployees, employees, setLoader, perPage, page, offset, limit, setTotal, name)
        }

    }, [offset])
    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <Box>
                    <Button variant='contained' startIcon={<SearchIcon />} sx={{ borderRadius: '2rem' }} onClick={() => handleNavigateMain(navigate)}>{matches ? 'details' : 'view details'}</Button>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: matches ? 'column' : 'row', justifyContent: 'space-between', mt: 1, width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: matches ? 'space-between' : 'flex-start', width: matches ? '100%' : 'auto', gap: matches ? 1 : 1 }}>
                    <TextField label="employee name" value={name} size='small' onChange={(e) => setName(e.target.value)} />
                    <Button variant='contained' color="success" sx={{ color: '#fff', borderRadius: '2rem' }} startIcon={<SearchIcon />} onClick={handleSearchEmployee}>{matches ? 'search' : 'search employee'}</Button>
                    {/* handleSearch(num, setNum, name, setEmployees, setLoader) */}
                </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end', height: '25px' }}>
                {loader && <CircularProgress sx={{ fontSize: '25px' }} size={20} />}
            </Box>
            <Slider {...settings} >
                {employees && employees.map((item, index) => (
                    <>
                        {/* onClick={() => handleNavigate(item.employee_id, navigate, dispatch, employeeRouteParamCall)} */}
                        <EmployeeCard key={item.id} data={item} link={<Link to={`/${process.env.REACT_APP_HOST}/homepage/view-pds/${item?.employee_id}`} target='blank' ><Button variant='contained' sx={{ borderRadius: 0 }} fullWidth startIcon={<Person />} >view PDS</Button></Link>} />
                    </>
                ))}
                {employees && employees.length === 0 && Array.from(Array(4)).map((item, index) => (
                    <EmployeeCard key={index} data={null} onClick={() => { }} />
                ))}
            </Slider>
        </Box>
    )
}

export default EmployeeManagement