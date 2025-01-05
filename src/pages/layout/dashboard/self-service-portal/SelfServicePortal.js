import React, { useEffect,useState } from 'react'
import { Grid, Box, Card, CardContent, Typography, TextField , Skeleton , Stack,LinearProgress } from '@mui/material'
import { blue, green, red,yellow,purple, indigo } from '@mui/material/colors'
// odometer for dashboard cards figures animation
import Odometer from 'react-odometerjs';
import odometerCss from '../../../../odometer.css'
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { useSpring, animated } from 'react-spring'
// mui icons
import DraftsIcon from '@mui/icons-material/Drafts';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import ArticleIcon from '@mui/icons-material/Article';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { getUserMenus } from '../menurequest/MenuRequest';
// components
// import Cards from './cards/Cards'
import ServicePortalCards from './cards/ServicePortalCards'

const SelfServicePortal = () => {
    const [menu,setMenu] = useState([])

    useEffect(()=>{
        const location = 'SELF-SERVICE-PORTAL'
        getUserMenus(location)
        .then((response)=>{
            // console.log('self',response)
            // console.log('usermenus',response)
            let newMenu = []
            response.data.menus.forEach(element => {
                switch(element.menu_name){
                    case 'Online Application':
                    var temp = {
                        title:element.menu_name.toUpperCase(),
                        uri:element.uri,
                        icon:<DraftsIcon sx={{ fontSize: '4rem', color: '#fff' }} />,
                        bgcolor:blue[500],
                        darkcolor:blue[800]
                    }
                    newMenu.push(temp);
                    break;
                    
                    case 'Daily Time Record':
                    var temp = {
                        title:element.menu_name.toUpperCase(),
                        uri:element.uri,
                        icon:<AccessTimeFilledIcon sx={{ fontSize: '4rem', color: '#fff' }} />,
                        bgcolor:green[500],
                        darkcolor:green[800]
                    }
                    newMenu.push(temp);
                    break;

                    case 'Online Leave Application / CTO':
                    var temp = {
                        title:element.menu_name.toUpperCase(),
                        uri:element.uri,
                        icon:<StickyNote2Icon sx={{ fontSize: '4rem', color: '#fff' }} />,
                        bgcolor:indigo[500],
                        darkcolor:indigo[800]
                    }
                    newMenu.push(temp);
                    break;

                    case 'CTO':
                    var temp = {
                        title:element.menu_name.toUpperCase(),
                        uri:element.uri,
                        icon:<StickyNote2Icon sx={{ fontSize: '4rem', color: '#fff' }} />,
                        bgcolor:indigo[500],
                        darkcolor:indigo[800]
                    }
                    newMenu.push(temp);
                    break;

                    case 'Pass Slip / Undertime Permit':
                    var temp = {
                        title:element.menu_name.toUpperCase(),
                        uri:element.uri,
                        icon: <ArticleIcon sx={{ fontSize: '4rem', color: '#fff' }} />,
                        bgcolor:purple[500],
                        darkcolor:purple[800]
                    }
                    newMenu.push(temp);
                    break;

                    case 'Payslip':
                    var temp = {
                        title:element.menu_name.toUpperCase(),
                        uri:element.uri,
                        icon:<LocalAtmIcon sx={{ fontSize: '4rem', color: '#fff' }} />,
                        bgcolor:yellow[500],
                        bgcolor:yellow[800]
                    }
                    newMenu.push(temp);
                    break;
                }
            });
            setMenu(newMenu)
        }).catch((error)=>{
            console.log(error)
        })
    },[])
    return (
        <Card raised>
        <CardContent>
            <Box>
                <Typography><b>Self-Service Portal</b></Typography>
                <Grid container spacing={0} sx={{display:'flex',flexDirection:'row',justifyContent:'space-around'}}>
                    {menu && menu.length !==0
                        ?
                        menu.map((item,key) => (
                            <Grid item xs={6} sm={6} md={2} lg={2} key = {key}>
                                <ServicePortalCards title={item.title} icon={item.icon} bgcolor={item.bgcolor} darkcolor={item.darkcolor} uri ={item.uri} />
                            </Grid>
                        ))
                        :
                        // <Stack spacing={1} sx={{ display: 'flex', alignItems: 'center', height: '100%',width:'100%'}}>
                        //     <Skeleton variant="rectangular" width={'100%'} height={200} />
                        // </Stack>
                        [1,2,3,4,5,6].map((item,key) => (
                            <Grid item xs={6} sm={6} md={2} lg={2} key = {key}>
                                <ServicePortalCards title={''} icon={''} bgcolor={''} darkcolor={''} uri ={''} />
                            </Grid>
                        ))
                        // <Box sx={{ width: '100%' }}>
                        // <LinearProgress />
                        // </Box>
                    }
                    
                </Grid>

            </Box>
        </CardContent>
    </Card>
    )
}

export default SelfServicePortal