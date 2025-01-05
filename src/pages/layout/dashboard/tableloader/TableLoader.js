import { Grid, Skeleton, Typography } from '@mui/material';
import React from 'react';
import LoopIcon from '@mui/icons-material/Loop';
import './TableLoader.css';

export default function TableLoader(){
    return (
        <Grid container>
            <Grid item xs={12}>
                <Skeleton animation="wave" variant="rectangular" width={'100%'} height={'40px'} sx={{borderTopLeftRadius:'5px',borderTopRightRadius:'5px'}}/>
                <div style={{position:'relative'}}>
                <Skeleton animation="wave" variant="rectangular" width={'100%'} height={'250px'} sx={{marginTop:'5px',borderBottomLeftRadius:'5px',borderBottomRightRadius:'5px'}}/>
                <Typography className='loading-text'>Loading Data ...</Typography>
                </div>

            </Grid>
        </Grid>
    )
}