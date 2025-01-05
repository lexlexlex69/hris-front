import React, { useState } from 'react';
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import EducationComponent from './Education'
import EligibilityComponent from './Eligibility'
import WorkExpComponent from './WorkExp'
import TrainingsComponent from './Trainings'
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Alert from '@mui/material/Alert';





const PlantillaPreferences = ({ data }) => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [value, setValue] = useState('1')
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', px: { xs: 0, md: 20 } }}>
            <Container maxWidth="lg" sx={{ mt: 1 }}>
                <Typography variant="body2" color="primary"> POINT SYSTEM / PLANTILLA PREFERENCES</Typography>
                <Alert severity="info" sx={{ mt: 1 }}> <Box>
                    <Typography variant="body2" color="initial">
                        POSITION: {data.position_name}
                    </Typography>
                    <Typography variant="body2" color="initial" mt={1}>
                        ITEM #: {data.new_item_no}
                    </Typography>
                </Box></Alert>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example" sx={{ m: 0 }}>
                            <Tab label="Education" value="1" sx={{ fontSize: matches ? '.5rem' : null, fontWeight: matches ? 'bold' : null }} />
                            <Tab label="Eligibility" value="2" sx={{ fontSize: matches ? '.5rem' : null, fontWeight: matches ? 'bold' : null }} />
                            <Tab label={matches ? "Work" : "Work Experience"} value="3" sx={{ fontSize: matches ? '.5rem' : null, fontWeight: matches ? 'bold' : null }} />
                            <Tab label="Trainings" value="4" sx={{ fontSize: matches ? '.5rem' : null, fontWeight: matches ? 'bold' : null }} />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        <EducationComponent id={data.id} />
                    </TabPanel>
                    <TabPanel value="2">
                        <EligibilityComponent id={data.id} />
                    </TabPanel>
                    <TabPanel value="3">
                        <WorkExpComponent id={data.id} />
                    </TabPanel>
                    <TabPanel value="4">
                        <TrainingsComponent id={data.id} />
                    </TabPanel>
                </TabContext>
            </Container>
        </Box>
    );
};

export default PlantillaPreferences;