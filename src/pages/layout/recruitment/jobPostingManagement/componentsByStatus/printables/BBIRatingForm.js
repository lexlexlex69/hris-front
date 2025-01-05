import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box'
import Bl from '../../../../../../assets/img/bl.png'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'

const BBIRatingForm = ({ consensusStatus, printData }) => {
    const [consensus, setConsensus] = useState([])
    useEffect(() => {
        let temp = [...consensusStatus]
        let newTemp = temp.map((item, index) => {
            return {
                ...item, items: [
                    {
                        title: 'Exemplifying integrity',
                        definition: "The ability to show by example in the faithful adherence to moral and ethical standards. It illutrates a person's level of honesty, moral commitments, and willingness to do what is right.",
                        rating: item.exemplifying_integrity,
                        situation: item.exemplifying_integrity_situation,
                        action: item.exemplifying_integrity_action,
                        result: item.exemplifying_integrity_result,
                    },
                    {
                        title: 'Thinking strategically and creatively',
                        definition: 'The ability to "see big picture", think multi-dimentiosnally, craft innovative solutions, identify connections between situations or thinks that are not obviously related, and come up with new ideas and different ways to enhance organizational effectiveness and responsiveness',
                        coreDefinition: 'Displays awareness and support the vision, misson, values, objectives and purposesof the agency or organization.',
                        rating: item.strategic_creativity,
                        situation: item.strategic_creativity_situation,
                        action: item.strategic_creativity_action,
                        result: item.strategic_creativity_result,
                    },
                    {
                        title: 'Solving problems and decision making',
                        definition: "The ability to work through details of a problem and select a logical choice from the available options to reach a solution. It includes mathematical or systematic operations that can gauge an individual's critical thinking skills.",
                        rating: item.solving_problems,
                        situation: item.solving_problems_situation,
                        action: item.solving_problems_action,
                        result: item.solving_problems_result,
                    },
                    {
                        title: 'Creating and nurturing a high performing organization',
                        definition: 'The ability to create a high performing organizational culture that is purpose driven, results based, client and team oriented.',
                        coreDefinition: 'Builds a shared sense of commitment to a common goal among individuals and utilizes interventions to help close gaps or improve competence of staff t oachieve the goal.',
                        rating: item.high_performance_organization,
                        situation: item.high_performance_organization_situation,
                        action: item.high_performance_organization_action,
                        result: item.high_performance_organization_result,
                    },
                    {
                        title: 'Delivering service excellence ',
                        definition: "The ability to focus on the customers' needs, keeping the stakeholders positive and empowered, and continually improving the current activities/services in the workplace/organiztion.",
                        rating: item.delivering_service,
                        situation: item.delivering_service_situation,
                        action: item.delivering_service_action,
                        result: item.delivering_service_result,
                    },
                    {
                        title: 'Leading change',
                        definition: 'The ability to generate genuine enthusiasm and momentum for organizational change, it involves engaging and enabling groups to understand, accept and commit to the change agenda. It also includes advacing and sustaining changes.',
                        coreDefinition: 'Basic. Response effectively to the need or reason for change and participates in the activities or initiatives inherent to it.',
                        rating: item.leading_change,
                        situation: item.leading_change_situation,
                        action: item.leading_change_action,
                        result: item.leading_change_result,
                    },
                    {
                        title: 'Building collaborative, inclusive working relationships',
                        definition: "The ability to show by example in the faithful adherence to moral and ethical standards. It illutrates a person's level of honesty, moral commitments, and willingness to do what is right.",
                        coreDefinition: 'Basic. Maximize existing partnerships and networks and capitalizes on these to deliver or enhance work outcomes.',
                        rating: item.working_relationship,
                        situation: item.working_relationship_situation,
                        action: item.working_relationship_action,
                        result: item.working_relationship_result,
                    },
                    {
                        title: 'Managing performance and coaching results',
                        definition: "The ability to show by example in the faithful adherence to moral and ethical standards. It illutrates a person's level of honesty, moral commitments, and willingness to do what is right.",
                        coreDefinition: 'Basic. Monitors work and /or team climate and applies the appropriate action using available tools, including basinc knowledge of coaching, to ensure that work or performance matches or excceds the required standard.',
                        rating: item.coaching_result,
                        situation: item.coaching_result_situation,
                        action: item.coaching_result_action,
                        result: item.coaching_result_result,
                    }
                ]
            }
        })
        console.log(newTemp)
        setConsensus(newTemp)
    }, [consensusStatus])
    return (
        <>
            {consensus && consensus.map((interviewer, index) => (
                <>
                    {
                        interviewer.items.map((item, index) => (
                            <div style={{ padding: '60px 100px' }} className="force-break">
                                <Box display="flex" sx={{ justifyContent: 'flex-start' }}>
                                    <Box>
                                        <img src={Bl} width="50" />
                                    </Box>
                                    <Box display="flex" sx={{ flexDirection: 'column', width: '100%', pl: 1 }}>
                                        <Box display="flex" sx={{ justifyContent: 'space-between' }}>
                                            <Typography variant="body1" color="initial">City Government of Butuan</Typography>
                                            <Typography variant="body2" color="initial">CHRMO-PSTD-BBI Form 1</Typography>
                                        </Box>
                                        <Typography variant="body1" color="initial" fontWeight={700} letterSpacing={1}>City Human Resource Management Office</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ mt: 5 }}>
                                    <Typography variant="h6" color="initial" align='center' fontWeight={700} letterSpacing={1}>BEHAVIORAL-BASED INTERVIEW (BBI) RATING FORM</Typography>
                                </Box>
                                <TableContainer>
                                    <Table aria-label="interviewee info table" size='small'>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell align="left" sx={{ border: '1px solid black' }}>
                                                    <Box>
                                                        <Typography variant="body1" color="initial">Name of Interviewee:</Typography>
                                                        <Typography variant="body1" color="initial">{printData?.profile?.fname} {printData?.profile?.mname} {printData?.profile?.lname}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="left" sx={{ border: '1px solid black' }}>
                                                    <Box>
                                                        <Typography variant="body1" color="initial">Position Applied for:</Typography>
                                                        <Typography variant="body1" color="initial">{printData.position_title}</Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="left" sx={{ border: '1px solid black' }}>
                                                    <Box>
                                                        <Typography variant="body1" color="initial">Name of Interviewer:</Typography>
                                                        <Typography variant="body1" color="initial">{interviewer?.fname} {interviewer?.mname} {interviewer?.lname}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="left" sx={{ border: '1px solid black' }}>
                                                    <Box>
                                                        <Typography variant="body1" color="initial">Date of Interview:</Typography>
                                                        <Typography variant="body1" color="initial">{printData.interview_date}</Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <TableContainer sx={{ mt: 3 }}>
                                    <Table aria-label="bbi info table" size='small'>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell align="left" sx={{ bgcolor: '#BEBEBE', border: '1px solid black' }}>
                                                    <Box>
                                                        <Typography variant="body1" color="initial">Target Competency:</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="left" sx={{ bgcolor: '#BEBEBE', border: '1px solid black' }}>
                                                    <Box>
                                                        <Typography variant="body2" color="initial"><b>{item.title}</b></Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="left" sx={{ bgcolor: '#BEBEBE', border: '1px solid black' }}>
                                                    <Box>
                                                        <Typography variant="body1" color="initial">Definition:</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="left" sx={{ bgcolor: '#BEBEBE', border: '1px solid black' }}>
                                                    <Box>
                                                        <Typography variant="body2" color="initial" align='justify'>{item.definition}</Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                            {item?.coreDefinition && (
                                                <TableRow>
                                                    <TableCell align="left" sx={{ bgcolor: '#BEBEBE', border: '1px solid black' }}>
                                                        <Box>
                                                            <Typography variant="body1" color="initial">Core Definition:</Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="left" sx={{ bgcolor: '#BEBEBE', border: '1px solid black' }}>
                                                        <Box>
                                                            <Typography variant="body2" color="initial" align='justify'>{item.coreDefinition}</Typography>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            <TableRow>
                                                <TableCell size='medium' align="left" sx={{ border: '1px solid black' }}>
                                                    <Box>
                                                        <Typography variant="body1" color="initial">Situation or  Task/s:</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="left" sx={{ border: '1px solid black' }}>
                                                    <Box>
                                                        <Typography variant="body2" color="initial">{item?.situation}</Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell size='medium' align="left" sx={{ border: '1px solid black' }}>
                                                    <Box>
                                                        <Typography variant="body1" color="initial">Action/s:</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="left" sx={{ border: '1px solid black' }}>
                                                    <Box>
                                                        <Typography variant="body2" color="initial">{item?.action}</Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell size='medium' align="left" sx={{ border: '1px solid black' }}>
                                                    <Box>
                                                        <Typography variant="body1" color="initial">Result/s:</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="left" sx={{ border: '1px solid black' }}>
                                                    <Box>
                                                        <Typography variant="body2" color="initial">{item?.result}</Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="left" sx={{ border: '1px solid black' }}>
                                                    <Box>
                                                        <Typography variant="body1" color="initial">Rating Scale:</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="left" sx={{ border: '1px solid black' }}>
                                                    <Box>
                                                        <Typography variant="body2" color="initial">
                                                            5 - Significant; 4 - More than Acceptable; 3 - Acceptable; 2 - Less Acceptable; and 1 - Not Acceptable
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow >
                                                <TableCell align="left" sx={{ border: '1px solid black' }}>
                                                    <Box>
                                                        <Typography variant="body1" color="initial">Rating <span style={{ fontSize: '10px' }}>(Encircle the number of your choice)</span></Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="left" sx={{ border: '1px solid black' }}>
                                                    <Box display="flex" sx={{ justifyContent: 'space-around' }}>
                                                        <Typography variant="body1" color="initial" sx={{ border: `${item.rating === 5 ? '1px' : '0px'} solid black`, borderRadius: '100%', height: 30, width: 30, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                            5
                                                        </Typography>
                                                        <Typography variant="body1" color="initial" sx={{ border: `${item.rating === 4 ? '1px' : '0px'} solid black`, borderRadius: '100%', height: 30, width: 30, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                            4
                                                        </Typography>
                                                        <Typography variant="body1" color="initial" sx={{ border: `${item.rating === 3 ? '1px' : '0px'} solid black`, borderRadius: '100%', height: 30, width: 30, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                            3
                                                        </Typography>
                                                        <Typography variant="body1" color="initial" sx={{ border: `${item.rating === 2 ? '1px' : '0px'} solid black`, borderRadius: '100%', height: 30, width: 30, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                            2
                                                        </Typography>
                                                        <Typography variant="body1" color="initial" sx={{ border: `${item.rating === 1 ? '1px' : '0px'} solid black`, borderRadius: '100%', height: 30, width: 30, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                            1
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                            </div>
                        ))
                    }
                </>
            ))}

        </>
    );
};

export default React.memo(BBIRatingForm);