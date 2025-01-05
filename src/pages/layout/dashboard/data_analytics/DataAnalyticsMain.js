import React, { useEffect, useState, useRef } from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import { blue } from '@mui/material/colors'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPeopleGroup } from '@fortawesome/free-solid-svg-icons'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AnalyticsIcon from '@mui/icons-material/Analytics';

// modals
import InventoryPersonnel from './data_analytics_modals/InventoryPersonnel'
import TotalEmployee from './data_analytics_graphs/TotalEmployee'
import EmploymentStatus from './data_analytics_graphs/EmploymentStatus'
import MaleFemale from './data_analytics_graphs/MaleFemale'
import { getAnalytics, setDataAnalyticsGraph, getAnalyticsDetailed } from './Controller'

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import drilldown from "highcharts/modules/drilldown.js";
import exporting from "highcharts/modules/exporting.js";
import exportData from "highcharts/modules/export-data.js";
import SlickCards from './SlickCards'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


drilldown(Highcharts);
exporting(Highcharts);
exportData(Highcharts);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


function DataAnalyticsMain() {

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <ArrowForwardIosIcon
        className={className}
        style={{ ...style, display: "block", color: blue[500] }}
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
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: true
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
          slidesToScroll: 1
        }
      }
    ]
  };

  const [applicants,setApplicants] = useState([])

  const [dataAnalytics, setDataAnalytics] = useState('')
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // modal

  // dialog
  const [openD, setOpenD] = React.useState(false);

  const [openCategory, setOpenCategory] = React.useState(false);
  const handleOpenCategory = () => setOpenCategory(true);
  const handleCloseCategory = () => {
    setCategory('')
    setOpenCategory(false)
  };
  const [options, setOptions] = useState('')
  const [category, setCategory] = useState('')
  const categoryRef = useRef(true)

  useEffect(() => {
    getAnalyticsDetailed(setDataAnalytics,setApplicants)
  }, [])

  useEffect(() => {
    setDataAnalyticsGraph(dataAnalytics, setOptions, setCategory)
  }, [dataAnalytics])

  useEffect(() => {
    if (categoryRef.current) {
      categoryRef.current = false
    }
    else {
      if (category) {
        handleOpenCategory()
      }
    }

  }, [category])
  return (
    <Box sx={{ flex: 1, px: 2 }}>
      {/* dialog for graph */}
      <Dialog
        fullScreen
        open={openCategory}
        onClose={handleCloseCategory}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseCategory}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              close
            </Typography>
          </Toolbar>
        </AppBar>
        <Box display="" p={2} sx="">
          {category === 'TOTAL EMPLOYEE' ? (
            <TotalEmployee />
          ) : category === 'PERMANENT' || category === 'TEMPORARY' || category === 'PRESIDENTIAL APPOINTEES' || category === 'CO-TERMINOS' || category === 'CONTRACTUAL' || category === 'CASUAL' || category === 'JOB ORDER' || category === 'CONSULTANT' || category === 'CONTRACT OF SERVICE' ? (
            <>
              <EmploymentStatus category={category} />
            </>
          ) : category === 'MALE' || category === 'FEMALE' ? (
            <MaleFemale category={category} />
          ) : null}
        </Box>
      </Dialog>
      {/* dialog for inventory */}
      <Dialog
        fullScreen
        open={open}
        sx={{ height: '100vh' }}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              close
            </Typography>
          </Toolbar>
        </AppBar>
        <Box display="" p={2} >
          <InventoryPersonnel />
        </Box>
      </Dialog>
      <Typography sx={{ color: blue[500], mb: 1 }}> <AnalyticsIcon /> Data analytics</Typography>
      <Box>
        <Box width="90%" sx={{ m: 'auto', py: 2 }}>
          <Slider {...settings}>
            <SlickCards icon={<FontAwesomeIcon icon={faPeopleGroup} fontSize='50px' color='#fff' />} number={false} title='inventory' onClick={handleOpen} hasDetails />
            <div>
              <SlickCards title='Applicants' icon={<PeopleAltIcon sx={{fontSize:'50px',color:'#fff'}} />} number={applicants} />
            </div>
            <div>
              <SlickCards title='Active employees' />
            </div>
            <div>
              <SlickCards title='In-active employees' />
            </div>
            <div>
              <SlickCards />
            </div>
          </Slider>
        </Box>
      </Box>
      <Box sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Box sx={{ height: '100%', width: '100%' }}>
              <Box display='flex'>
                <Typography color='#fff' bgcolor='#BEBEBE' p={.5} px={1} borderRadius={.5}>Employees data</Typography>
              </Box>
              <HighchartsReact
                highcharts={Highcharts}
                options={options && options}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default DataAnalyticsMain