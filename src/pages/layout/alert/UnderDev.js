import React from 'react';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import { Alert } from '@mui/material';
export default function UnderDev(){
    return(
        <Alert severity="info"><ConstructionOutlinedIcon fontSize='small'/> This module is under development. Some functionality will be available soon. </Alert>
    )
}