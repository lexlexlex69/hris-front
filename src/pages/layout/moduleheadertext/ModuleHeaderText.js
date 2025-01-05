import React,{useState} from 'react';

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography } from '@mui/material';

export default function ModuleHeaderText(props){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    return(
        // <Typography variant='h5' sx={{fontSize:matches?'18px':'1.1rem',color:'#fff',textAlign:matches?'center':'left',pt:1,pb:1,pl:matches?0:2,borderBottomLeftRadius:matches?0:'20px',borderTopRightRadius:matches?0:'20px'}} className='custom-boxshadow-header'>
        // {props.title}
        // </Typography>
        // <Typography>{props.title}</Typography>
        <></>
    )
}