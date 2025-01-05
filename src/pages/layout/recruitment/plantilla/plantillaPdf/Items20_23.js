import React from 'react';
import Typography from '@mui/material/Typography'
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';


const Items20_23 = ({ data }) => {
    return (
        <div>
            <table className='plantillaPdfTable '>
                <tr style={{ backgroundColor: '#BEBEBE' }}>
                    <td colSpan={4}>
                        <Typography className='font-12px' color="initial">
                            20. BRIEF DESCRIPTION OF THE GENERAL FUNCTION OF THE POSITION (job Summary)
                        </Typography>
                    </td>
                </tr>
                <tr>
                    <td colSpan={4} style={{ height: '400px', width: '100%', verticalAlign: 'top' }}>
                        <Box display='flex' justifyContent='flex-start' flexDirection='column' pl={2}>
                            {data.desc_job_summary?.split(';').map((item, i) => (
                                <>
                                    <Typography className='font-12px' color="initial">
                                        {item}
                                    </Typography>
                                </>
                            ))}
                        </Box>


                    </td>
                </tr>
                <tr style={{ backgroundColor: '#BEBEBE' }}>
                    <td colSpan={4}>
                        <Typography className='font-12px' color="initial">
                           21. QUALIFICATION STANDARDS
                        </Typography>
                    </td>
                </tr>
                <tr style={{ backgroundColor: '#BEBEBE' }}>
                    <td>
                        <Typography className='font-12px' color="initial">
                            21a. Education
                        </Typography>
                    </td>
                    <td>
                        <Typography className='font-12px' color="initial">
                            21b. Experience
                        </Typography>
                    </td>
                    <td>
                        <Typography className='font-12px' color="initial">
                            21c. Training
                        </Typography>
                    </td>
                    <td>
                        <Typography className='font-12px' color="initial">
                            21d. Eligibility
                        </Typography>
                    </td>
                </tr>
                <tr>
                    <td>
                        <Typography className='font-12px' color="initial">
                            {data.qs?.education}
                        </Typography>
                    </td>
                    <td>
                        <Typography className='font-12px' color="initial">
                            {data.qs?.experience}
                        </Typography>
                    </td>
                    <td>
                        <Typography className='font-12px' color="initial">
                            {data.qs?.training}
                        </Typography>
                    </td>
                    <td>
                        <Typography className='font-12px' color="initial">
                            {data.qs?.eligibility ? data.qs?.eligibility : <>&nbsp;</>}
                        </Typography>
                    </td>
                </tr>
                {/*  */}
                <tr style={{ backgroundColor: '#BEBEBE' }}>
                    <td colSpan={3}>
                        <Typography className='font-12px' color="initial">
                            Core Competencies
                        </Typography>
                    </td>
                    <td>
                        <Typography className='font-12px' color="initial">
                            Competency Level
                        </Typography>
                    </td>
                </tr>
                <tr>
                    <td colSpan={3}>
                        <Typography className='font-12px' color="initial">
                            {data.core_competency}
                        </Typography>
                    </td>
                    <td>
                        <Typography className='font-12px' color="initial">
                            {data.core_level}
                        </Typography>
                    </td>
                </tr>
                {/*  */}
                <tr style={{ backgroundColor: '#BEBEBE' }}>
                    <td colSpan={3}>
                        <Typography className='font-12px' color="initial">
                            Leadership Competencies
                        </Typography>
                    </td>
                    <td>
                        <Typography className='font-12px' color="initial">
                            Competency Level
                        </Typography>
                    </td>
                </tr>
                <tr>
                    <td colSpan={3}>
                        <Typography className='font-12px' color="initial">
                            {data.leader_competency}
                        </Typography>
                    </td>
                    <td>
                        <Typography className='font-12px' color="initial">
                            {data.leader_level}
                        </Typography>
                    </td>
                </tr>
                {/*  */}
                <tr style={{ backgroundColor: '#BEBEBE' }}>
                    <td colSpan={3}>
                        <Typography className='font-12px' color="initial">
                            22. STATEMENT OF DUTIES AND RESPONSIBILITIES (Technical Competencies)
                        </Typography>
                    </td>
                    <td>
                        <Typography className='font-12px' color="initial">
                            Competency Level
                        </Typography>
                    </td>
                </tr>
                <tr>
                    <td>
                        <Typography className='font-12px' color="initial">
                            Percentage of Working Time
                        </Typography>
                    </td>
                    <td colSpan={2}>
                        <Typography className='font-12px' color="initial">
                            (State the duties and responsibilities here: )
                        </Typography>
                    </td>
                    <td rowSpan={2}>
                        <Typography className='font-12px' color="initial">
                            {data.technical_level}
                        </Typography>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {data.technical_percent && data.technical_percent.split(',').map((item, i) => (
                                <Typography className='font-12px' color="initial" key={i}>
                                    {item}
                                </Typography>
                            ))}
                        </div>
                    </td>
                    <td colSpan={2}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {data.technical_competency && data.technical_competency.split(',').map((item, i) => (
                                <Typography className='font-12px' color="initial" key={i}>
                                    {item}
                                </Typography>
                            ))}
                        </div>
                    </td>
                </tr>
                <tr style={{ backgroundColor: '#BEBEBE' }}>
                    <td colSpan={4}>
                        <Typography className='font-12px' color="initial">
                            23. ACKNOWLEDGMENT AND ACCEPTANCE
                        </Typography>
                    </td>
                </tr>
                <tr>
                    <td colSpan={4} style={{ padding: '10px 40px' }}>
                        <Typography className='font-12px' color="initial" sx={{ p: 5 }}>
                            I have received a copy of this position description. It has been discussed with me and I have freely chosen to comply with the performance and behavior/conduct expectations contained herin.
                        </Typography>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <Typography className='font-12px' color="initial">
                                    Employee's Name, Date and Signature
                                </Typography>
                            </div>
                            <div>
                                <Typography className='font-12px' color="initial">
                                    Supervisor's Name, Date and Signature
                                </Typography>
                            </div>

                        </div>
                    </td>
                </tr>
            </table>
        </div>
    );
};

export default Items20_23;