import { Grid, Typography } from '@mui/material';
import React from 'react';

export default function NotFound(){
    return(
    <Grid container>
        <Grid item xs={12}>
            <Typography>Oops.. Link not found !</Typography>
        </Grid>
    </Grid>
    )
}