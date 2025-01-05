import React, { useState } from 'react'
import Box from '@mui/material/Box';

import BasicPds from './basic_pds/BasicPds'

function Qs({ setApplicantStatus }) {

    const [steps, setSteps] = useState(0)
    return (
        <Box sx={{ flex: 1 }} >
            <BasicPds setApplicantStatus={setApplicantStatus} />
        </Box>
    )
}

export default Qs