import React from 'react'
import { red, blue, green, yellow } from '@mui/material/colors'
import Typography from '@mui/material/Typography'

function UnderDevWrapper({ children,title }) {
    return (
        <div style={{ position: 'relative',width:'100%' }}>
            <Typography sx={{ position: 'absolute', bgcolor: 'warning.main', p: 1, width: '100%', top: '40%', zIndex: 5,color:'#fff' }} align="center" > {title ? title : 'UNDER DEVELOPMENT'}</Typography>
            <div style={{ background:'rgba(39, 55, 77, 0.5)',backdropFilter:'blur(2px)',zIndex:4,height:'100%',width:'100%',position:'absolute' }}>
                <div style={{zIndex:3}}>
                </div>
            </div>
            {children}
        </div>
    )
}

export default UnderDevWrapper