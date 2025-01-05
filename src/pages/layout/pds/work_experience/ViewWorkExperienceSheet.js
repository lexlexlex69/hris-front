import React, { useRef } from 'react';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import moment from 'moment'
import { useReactToPrint } from 'react-to-print';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';



const ViewWorkExperienceSheet = ({ data }) => {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    return (
        <Box sx={{ height: '100%', overflowY: 'scroll' }} >
            <Box display="flex" mx="" my="" sx={{ justifyContent: 'flex-end' }}>
                <LocalPrintshopIcon onClick={handlePrint} color="primary" sx={{ cursor: 'pointer' }} />
            </Box>
            <div style={{ display: 'none' }}>
                <Box display="" mx="" my="" sx={{ px: '40px', py: '30px' }} ref={componentRef}>
                    <Box sx={{ border: '1px solid black' }}>
                        <Typography variant="body1" color="#fff" align="center" sx={{ bgcolor: '#969696', width: '100%', p: 1 }}>
                            WORK EXPERIENCE SHEET
                        </Typography>
                        <Box display="flex" sx={{ p: 1, bgcolor: '#EAEAEA', mb: 5 }}>
                            <Typography variant="body2" sx={{ width: '20%' }}>
                                <b>Instruction</b>
                            </Typography>
                            <Typography variant="body2" sx={{ width: '100%' }}>
                                <b>1. Include only the work experiences relevant to the position being applied to.</b><br />
                                <b>2. The duration should include start and finish dates, if known, month in abbreviated form, if known, and year in full. For the current position, use the word Present, e.g., 1998-Present. Work experience should be listed from most recent first.  </b>
                            </Typography>
                        </Box>
                        <Box sx={{ pl: 1 }}>
                            <Typography variant="body1" color="initial" gutterBottom>• Duration: {moment(data?.from).format('MMM YYYY')} - {moment(data?.to).format('MMM YYYY')}</Typography>
                            <Typography variant="body1" color="initial" gutterBottom>• Position: {data?.position}</Typography>
                            <Typography variant="body1" color="initial" gutterBottom>• Name of Office/Unit: {data?.nameOfOffice}</Typography>
                            <Typography variant="body1" color="initial" gutterBottom>• Immediate Supervisor: {data?.immediateSupervisor}</Typography>
                            <Typography variant="body1" color="initial" gutterBottom>• Name of Agency/Organization and Location: {data?.nameOfAgency}</Typography>
                            <Typography variant="body1" color="initial" gutterBottom>• List of Accomplishments and Contributions (if any):</Typography>
                            <Box sx={{ pl: 5 }}>
                                {data?.listOfAccomplishmentsArr.map((item, index) => (
                                    <Typography variant="body1" color="initial">• {item}</Typography>
                                ))}
                            </Box>
                            <Typography variant="body1" color="initial" gutterBottom>• Summary of Actual Duties:</Typography>
                            <Box sx={{ pl: 5 }}>
                                {data?.actualDuties}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </div>
            <Box display="" mx="" my="" sx={{ px: '40px', py: '30px' }}>
                <Box sx={{ pl: 1 }}>
                    <Typography variant="body1" color="initial" gutterBottom>• Duration: {moment(data?.from).format('MMM YYYY')} - {moment(data?.to).format('MMM YYYY')}</Typography>
                    <Typography variant="body1" color="initial" gutterBottom>• Position: {data?.position}</Typography>
                    <Typography variant="body1" color="initial" gutterBottom>• Name of Office/Unit: {data?.nameOfOffice}</Typography>
                    <Typography variant="body1" color="initial" gutterBottom>• Immediate Supervisor: {data?.immediateSupervisor}</Typography>
                    <Typography variant="body1" color="initial" gutterBottom>• Immediate Supervisor: {data?.immediateSupervisor}</Typography>
                    <Typography variant="body1" color="initial" gutterBottom>• Name of Agency/Organization and Location: {data?.nameOfAgency}</Typography>
                    <Typography variant="body1" color="initial" gutterBottom>• List of Accomplishments and Contributions (if any):</Typography>
                    <Box sx={{ pl: 5 }}>
                        {data?.listOfAccomplishmentsArr.map((item, index) => (
                            <Typography variant="body1" color="initial">• {item}</Typography>
                        ))}
                    </Box>
                    <Typography variant="body1" color="initial" gutterBottom>• Summary of Actual Duties:</Typography>
                    <Box sx={{ pl: 5 }}>
                        {data?.actualDuties}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ViewWorkExperienceSheet;