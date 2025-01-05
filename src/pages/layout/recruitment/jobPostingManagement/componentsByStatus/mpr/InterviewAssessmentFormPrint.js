import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, Checkbox } from '@mui/material';
import { AssessmentContext } from './AssessmentFormContext';

const InterviewAssessmentFormPrint = ({ applicantData, interviewerData }) => {
    const positionInfo = useContext(AssessmentContext)
    const grey = '#9DB2BF'
    const [rating, setRating] = useState([
        {
            title: 'Education and Experience',
            description: 'Appropriate education qualifications or training for the position applied for; Acquired similar skills or qualifications through past work experiences (Check for employment gaps)',
            hr: '',
            im: '',
            nlh: ''
        },
        {
            title: 'Job Knowledge and competencies (Technical Qualifications)',
            description: 'Being honest and having strong moral principles; moral uprigtness. It is generally a personal choice to hold oneself to consistnent moral and ethical standards.',
            hr: '',
            im: '',
            nlh: ''
        },
        {
            title: 'Customer-Centered Service',
            description: 'The candidate demonstrate the knowledge and skills to create a positive customer or experience/interaction necessary forthis position.',
            hr: '',
            im: '',
            nlh: ''
        },
        {
            title: 'Passion for Excellence (General Appearance and Confidence)',
            description: 'Creates an excellent appearance; a very likeable person; shows determination and confidence; high interest level in the desired position.',
            hr: '',
            im: '',
            nlh: ''
        },
        {
            title: 'Communication',
            description: 'The ability to convey articulate information effectively in both verbal and non-verbal communication skills.',
            hr: '',
            im: '',
            nlh: ''
        },
        {
            title: 'Leadership Ability',
            description: 'Demonstrate the leadership skills necessary for the position; high potentials.',
            hr: '',
            im: '',
            nlh: ''
        },
        {
            title: 'Synergy',
            description: 'The ability to work well with others. willingness to cooperate; a team player.',
            hr: '',
            im: '',
            nlh: ''
        },
        {
            title: 'Potential and Role Fitness',
            description: 'The candidate\'s overall potential and fitness to the role and the organization',
            hr: '',
            im: '',
            nlh: ''
        },
        {
            title: '',
            description: 'Overall Assessment Rating (Part1)',
            hr: '',
            im: '',
            nlh: ''
        },
    ])

    useEffect(() => {
        let tempRating = [...rating]
        interviewerData.map((x, i) => {
            if (x.done_rate === 1) {
                if (x.type === 'hr') {
                    tempRating[0].hr = x.education_experience
                    tempRating[1].hr = x.competencies
                    tempRating[2].hr = x.customer_centered_service
                    tempRating[3].hr = x.passion_excellence
                    tempRating[4].hr = x.communication
                    tempRating[5].hr = x.leadership_ability
                    tempRating[6].hr = x.synergy
                    tempRating[7].hr = x.role_fitness
                    tempRating[8].hr = x.overall_rating
                }
                if (x.type === 'im') {
                    tempRating[0].im = x.education_experience
                    tempRating[1].im = x.competencies
                    tempRating[2].im = x.customer_centered_service
                    tempRating[3].im = x.passion_excellence
                    tempRating[4].im = x.communication
                    tempRating[5].im = x.leadership_ability
                    tempRating[6].im = x.synergy
                    tempRating[7].im = x.role_fitness
                    tempRating[8].im = x.overall_rating
                }
                if (x.type === 'nlh') {
                    tempRating[0].nlh = x.education_experience
                    tempRating[1].nlh = x.competencies
                    tempRating[2].nlh = x.customer_centered_service
                    tempRating[3].nlh = x.passion_excellence
                    tempRating[4].nlh = x.communication
                    tempRating[5].nlh = x.leadership_ability
                    tempRating[6].nlh = x.synergy
                    tempRating[7].nlh = x.role_fitness
                    tempRating[8].nlh = x.overall_rating
                }
            }
        })
        setRating(tempRating)
    }, [interviewerData])
    return (
        <div style={{ width: '100%' }}>
            <TableContainer>
                <Table sx={{ border: '1px solid black', '&: tr > td ': { border: '1px solid black' } }} size='small'>
                    <TableBody>
                        <TableRow sx={{ bgcolor: grey }}>
                            <TableCell align='center' colSpan={4}>
                                <Typography variant="body2" color="initial">INTERVIEW ASSESSMENT FORM</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Candidate Name</TableCell>
                            <TableCell>{applicantData?.info?.fname}</TableCell>
                            <TableCell>{applicantData?.info?.mname}</TableCell>
                            <TableCell>{applicantData?.info?.lname}</TableCell>
                        </TableRow>
                        <TableRow  >
                            <TableCell sx={{ border: '0px' }}>Position Applied For</TableCell>
                            <TableCell sx={{ border: '0px' }}>{positionInfo?.position_name}</TableCell>
                            <TableCell sx={{ border: '0px' }}>Area of Assignment</TableCell>
                            <TableCell sx={{ border: '0px' }}>{positionInfo?.dept_title}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <TableContainer sx={{ mt: 1 }}>
                <Table sx={{ border: '1px solid black', '&: tr > td ': { border: '1px solid black' } }} size='small'>
                    <TableBody>
                        <TableRow>
                            <TableCell align='left' colSpan={6}>
                                <Typography variant="body2" color="initial">
                                    Interview Assemsent Form mis to be completed by yhe intervieer t orank the candidate's overall qualifications for the position for which they have applied for. Under each  heading, the interviewer should give the candidate a numerical rating by putting mark () in the apporiate box.
                                    The numerical rating system is based on the scale below.
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ border: '0px' }}>Scale:</TableCell>
                            <TableCell sx={{ border: '0px' }}>5 - Very Strong</TableCell>
                            <TableCell sx={{ border: '0px' }}>4 - Strong</TableCell>
                            <TableCell sx={{ border: '0px' }}>3 - Acceptable</TableCell>
                            <TableCell sx={{ border: '0px' }}>2 - Weak</TableCell>
                            <TableCell sx={{ border: '0px' }}>1 - Very Weak</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <TableContainer sx={{ mt: 1 }}>
                <Table sx={{ border: '1px solid black', '&: tr > td ': { border: '1px solid black' } }} size='small'>
                    <TableBody>
                        <TableRow sx={{ bgcolor: grey }}>
                            <TableCell align='left' rowSpan={2}>
                                <Typography variant="body2" align='center' color="initial">
                                    PART 1: QUALIFICATIONS AND COMPETENCES
                                </Typography>
                            </TableCell>
                            <TableCell align='left' rowSpan={2}>
                                <Typography variant="body2" align='center' color="initial">
                                    RATER
                                </Typography>
                            </TableCell>
                            <TableCell align='left' colSpan={5}>
                                <Typography variant="body2" align='center' color="initial">
                                    Rating
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align='center'>5</TableCell>
                            <TableCell align='center'>4</TableCell>
                            <TableCell align='center'>3</TableCell>
                            <TableCell align='center'>2</TableCell>
                            <TableCell align='center'>1</TableCell>
                        </TableRow>
                        {rating && rating.map((item, index) => (
                            <React.Fragment key={index}>
                                <TableRow>
                                    <TableCell rowSpan={3} sx={{ p: 0, height: '1px', width: '60%' }}>
                                        <Box sx={{ height: '100%', p: 2 }}>
                                            <Typography variant="body2" color="initial">
                                                <b>{item.title}</b>
                                            </Typography>
                                            <Typography variant="body2" color="initial">
                                                <i>{item.description}</i>
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align='center' rowSpan={3} sx={{ p: 0, height: '1px', width: '20%' }}>
                                        <Box display='flex' flexDirection='column' justifyContent='space-around' sx={{ height: '100%' }}>
                                            <Typography variant="body2" color="initial">
                                                Human Resouce
                                            </Typography>
                                            <Typography variant="body2" color="initial">
                                                Immediate Head
                                            </Typography>
                                            <Typography variant="body2" color="initial">
                                                Next Level Head
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align='center'>
                                        <Checkbox checked={item?.hr === 5}></Checkbox>
                                    </TableCell>
                                    <TableCell align='center'>
                                        <Checkbox checked={item?.hr === 4}></Checkbox>
                                    </TableCell>
                                    <TableCell align='center'>
                                        <Checkbox checked={item?.hr === 3}></Checkbox>
                                    </TableCell>
                                    <TableCell align='center'>
                                        <Checkbox checked={item?.hr === 2}></Checkbox>
                                    </TableCell>
                                    <TableCell align='center'>
                                        <Checkbox checked={item?.hr === 1}></Checkbox>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align='center'>
                                        <Checkbox checked={item?.im === 5}></Checkbox>
                                    </TableCell>
                                    <TableCell align='center'>
                                        <Checkbox checked={item?.im === 4}></Checkbox>
                                    </TableCell>
                                    <TableCell align='center'>
                                        <Checkbox checked={item?.im === 3}></Checkbox>
                                    </TableCell>
                                    <TableCell align='center'>
                                        <Checkbox checked={item?.im === 2}></Checkbox>
                                    </TableCell>
                                    <TableCell align='center'>
                                        <Checkbox checked={item?.im === 1}></Checkbox>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align='center'>
                                        <Checkbox checked={item?.nlh === 5}></Checkbox>
                                    </TableCell>
                                    <TableCell align='center'>
                                        <Checkbox checked={item?.nlh === 4}></Checkbox>
                                    </TableCell>
                                    <TableCell align='center'>
                                        <Checkbox checked={item?.nlh === 3}></Checkbox>
                                    </TableCell>
                                    <TableCell align='center'>
                                        <Checkbox checked={item?.nlh === 2}></Checkbox>
                                    </TableCell>
                                    <TableCell align='center'>
                                        <Checkbox checked={item?.nlh === 1}></Checkbox>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TableContainer sx={{ mt: 1 }}>
                <Table sx={{ border: '1px solid black', '&: tr > td ': { border: '1px solid black' } }} size='small'>
                    <TableBody>
                        <TableRow>
                            <TableCell align='left'>
                                <Typography variant="body2" color="initial">
                                    RATER
                                </Typography>
                            </TableCell>
                            <TableCell align='left'>
                                <Typography variant="body2" color="initial">
                                    POTENTIAL STRENGHTS
                                </Typography>
                            </TableCell>
                            <TableCell align='left'>
                                <Typography variant="body2" color="initial">
                                    OTHER REMARKS
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ border: '0px' }}>Scale:</TableCell>
                            <TableCell sx={{ border: '0px' }}>5 - Very Strong</TableCell>
                            <TableCell sx={{ border: '0px' }}>4 - Strong</TableCell>
                            <TableCell sx={{ border: '0px' }}>3 - Acceptable</TableCell>
                            <TableCell sx={{ border: '0px' }}>2 - Weak</TableCell>
                            <TableCell sx={{ border: '0px' }}>1 - Very Weak</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div >
    );
};

export default React.memo(InterviewAssessmentFormPrint);