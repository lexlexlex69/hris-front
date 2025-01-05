import React,{useEffect, useState} from 'react';
import { Stack,Skeleton,Box } from '@mui/material';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
export default function DashboardLoading(props){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [actionButtons,setActionButtons] = useState([])
    useEffect(()=>{
        var temp = [...actionButtons]
        if(props.actionButtons){
            for(let i=0;i<props.actionButtons;i++){
                temp.push(<Skeleton variant='circular' height={40} width={40} animation="wave" key={i}/>)
            }
            setActionButtons(temp)
        }
    },[])
    const createButtons = ()=>{
        
    }
    return (
        <Stack spacing={1}>
            <Skeleton variant="rounded" height={matches?40:60} animation="wave"/>
            {
                props.actionButtons
                ?
                <Box sx={{display:'flex',justifyContent:'flex-end'}}>
                    {actionButtons}
                </Box>
                :
                null
            }
            <Stack spacing={1} sx={{mt:4}}>
                <Skeleton variant="rounded" height={50} animation="wave"/>
                <Skeleton variant="rounded" height={'40vh'} animation="wave"/>
            </Stack>
        </Stack>
    )
}