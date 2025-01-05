import React from 'react'
import { Container, Typography } from '@mui/material'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
export default function NotFound(){
    return(
        <Container>
            <Typography variant="h1" sx={{'textAlign':'center'}}>
                <SentimentVeryDissatisfiedIcon sx={{'fontSize':'1.5em'}}/>
                <Typography>Page Not Found</Typography>
            </Typography>
        </Container>
    )
}