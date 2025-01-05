import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import Panel from './Panel';
import MprPanel from './MprPanel';

import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};


const PanelMain = () => {
    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.down('sm'))
    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label={!matches ? "PERMANENT POSITION INTERVIEW DATA" : "PERMANENT"} {...a11yProps(0)} />
                        <Tab label={!matches ? "MAN POWER REQUEST INTERVIEW DATA" : "MPR"} {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <Panel />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <MprPanel />
                </TabPanel>
            </Box>
        </div>
    );
};

export default PanelMain;