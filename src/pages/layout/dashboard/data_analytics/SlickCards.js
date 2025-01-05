import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import Odometer from 'react-odometerjs';


const SlickCards = ({ icon, title, number, onClick = () => { }, hasDetails }) => {

    const [numberSetter, setNumberSetter] = useState(0)

    useEffect(() => {
        if (numberSetter !== null || numberSetter !== undefined) {
            setNumberSetter(number)
        }
    }, [number])
    return (
        <Card sx={{ maxWidth: '80%', m: 'auto', my: 1, minHeight: '150px', display: 'flex', flexDirection: 'column' }} elevation={5}>
            <Box height="70px" width="100%" display='flex' sx={{ bgcolor: 'success.light' }}>
                <Box flex={1} display="flex" justifyContent='center' alignItems='center'>
                    {icon ? icon : <QuestionMarkIcon sx={{ fontSize: '50px', color: '#fff' }} />}
                </Box>
                {number ? (
                    <Box flex={2} display="flex" justifyContent='flex-start' alignItems='center'>
                        <Typography variant="h3" color="#fff"><Odometer value={numberSetter} format="(ddd),dd" /></Typography>
                    </Box>
                ) :
                    null
                }

            </Box>
            <CardContent>
                <Typography gutterBottom variant={title?.length > 10 ? "body2" : "body2"} align='center' component="div" fontWeight={500} color="primary">
                    {title ? title?.toUpperCase() : '-'}
                </Typography>
            </CardContent>
            {hasDetails && (
                <CardActions sx={{ display: 'flex', justifyContent: 'flex-end', flex: 1, alignItems: 'flex-end' }}>
                    <Button variant='contained' sx={{ borderRadius: '2rem' }} startIcon={<SearchIcon />} size="small" onClick={() => onClick()}>details</Button>
                </CardActions>
            )}
        </Card>
    );
};

export default SlickCards;