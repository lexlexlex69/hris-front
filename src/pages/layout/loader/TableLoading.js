import React,{useEffect, useState} from 'react';
import { Stack,Skeleton,Box } from '@mui/material';
export default function TableLoading(props){
    const [actionButtons,setActionButtons] = useState([])
    useEffect(()=>{
        var temp = [...actionButtons]
        if(props.actionButtons){
            for(let i=0;i<props.actionButtons;i++){
                temp.push(<Skeleton variant='circular' height={40} width={40} animation="wave"/>)
            }
            setActionButtons(temp)
        }
    },[])
    const createButtons = ()=>{
        
    }
    return (
        <Stack spacing={1}>
            {
                props.actionButtons
                ?
                <Box sx={{display:'flex',justifyContent:'flex-end'}}>
                    {actionButtons}
                </Box>
                :
                null
            }
            <Skeleton variant='rounded' height={60} animation="wave"/>
            <Skeleton variant='rounded' height={150} animation="wave"/>
        </Stack>
    )
}