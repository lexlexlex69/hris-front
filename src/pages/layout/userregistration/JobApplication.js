import React from "react";
import {AppBar,Toolbar,Typography,Box,TextField,Container} from '@mui/material';
import BB from '../../../assets/img/balanghai.jpg'
import BL from '../../../assets/img/bl.png'
// import JobApplicationStepper from "../stepper/UserRegistrationStepper";
export default function JobApplication(){
    //email
    const [email,setEmail] = React.useState('');
    // appbar ref
    const appbarRef = React.useRef(null)
    const [appbarState, setAppbarState] = React.useState('')

    return(
        <Box >
            <AppBar position="static" ref={appbarRef}>
                <Toolbar sx={{ p: 1, display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                    <img src={BL} alt="" width={70} sx={{ m: 1 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Human Resource Information System
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container maxWidth = "sm">
                {/* <JobApplicationStepper/> */}
            </Container>
        </Box>
    )
}