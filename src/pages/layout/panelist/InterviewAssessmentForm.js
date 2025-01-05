import React, { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel'
import Button from '@mui/material/Button'
import { ArrowForward } from '@mui/icons-material';

import AssessmentBackdrop from './AssessmentBackdrop';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

let timerr = null
const InterviewAssessmentForm = ({ data, setAssessment, assessment, handleClose }) => {
    const [inputState, setInputState] = useState({
        applicant_id: data?.applicant_id,
        applicant_type: data?.applicant_type,
        dept_title: data?.dept_title,
        can_rate: data?.can_rate,
        done_rate: data?.done_rate,
        education_experience: data?.education_experience,
        communication: data?.communication,
        competencies: data?.competencies,
        customer_centered_service: data?.customer_centered_service,
        fname: data?.fname,
        hiring_recommendation_remark: data?.hiring_recommendation_remark,
        id: data?.id,
        integrity_professionalism: data?.integrity_professionalism,
        leadership_ability: data?.leadership_ability,
        lname: data?.lname,
        mname: data?.mname,
        other_remarks: data?.other_remarks,
        overall_rating: data?.overall_rating,
        overall_recommendation: data?.overall_recommendation,
        passion_excellence: data?.passion_excellence,
        position_name: data?.position_name,
        potential_strength: data?.potential_strength,
        rater_id: data?.rater_id,
        red_flags: data?.red_flags,
        remarks: data?.remarks,
        role_fitness: data?.role_fitness,
        synergy: data?.synergy,
        type: data?.type,
        vacancy_id: data?.vacancy_id
    })

    const [cbd, setCbd] = useState(false)

    async function rateForm(category, param) {
        if (inputState.done_rate) {
            return
        }
        setCbd(true)
        try {
            let res = await axios.post(`/api/recruitment/mpr-panelist/update-assessment`, { category: category, value: param, id: inputState.id })
            setCbd(false)
            if (res.data.status === 200) {
                setInputState(prev => ({ ...prev, [category]: param }))
                let updatedAssessment = Array.isArray(assessment) && assessment.map((item) => item?.id === inputState?.id ? ({ ...item, [category]: param }) : item)
                setAssessment(updatedAssessment)
            }
            else if (res.data.status === 500) {
                toast.error(res.data.message)
            }
        }
        catch (err) {
            toast.error(err.message)
            setCbd(false)
        }
    }

    async function rateFormText(category, param) {
        if (inputState.done_rate) {
            return
        }
        setInputState(prev => ({ ...prev, [category]: param }))
        clearTimeout(timerr)
        timerr = setTimeout(async () => {
            setCbd(true)
            try {
                let res = await axios.post(`/api/recruitment/mpr-panelist/update-assessment`, { category: category, value: param, id: inputState.id })
                setCbd(false)
                if (res.data.status === 200) {
                    setInputState(prev => ({ ...prev, [category]: param }))
                    let updatedAssessment = Array.isArray(assessment) && assessment.map((item) => item?.id === inputState?.id ? ({ ...item, [category]: param }) : item)
                    setAssessment(updatedAssessment)
                }
                else if (res.data.status === 500) {
                    toast.error(res.data.message)
                    setInputState(prev => ({ ...prev, [category]: data[category] }))
                }
            }
            catch (err) {
                toast.error(err.message)
                setInputState(prev => ({ ...prev, [category]: data[category] }))
                setCbd(false)
            }
        }, 500)
    }

    async function handleSubmit() {
        Swal.fire({
            title: 'Mark as final?',
            text: 'You won\'t be able to change your rating once it has been "marked" as final.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continue!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setCbd(true)
                try {
                    let res = await axios.post(`/api/recruitment/mpr-panelist/submit-assessment`, { type: inputState?.type, id: inputState.id, vacancy_id: inputState?.vacancy_id, applicant_id: inputState?.applicant_id })
                    handleClose()
                    if (res.data.status === 200) {
                        let updateAssessment = assessment.map((item) => {
                            if (item.id === inputState?.id) {
                                return { ...item, done_rate: 1 }
                            }
                            if (item.id === res.data.next_id) {
                                return { ...item, can_rate: 1 }
                            }
                            else {
                                return item
                            }
                        })
                        setAssessment(updateAssessment)
                    }
                    else if (res.data.status === 500) {
                        toast.error(res.data.message)
                    }
                    setCbd(false)
                }
                catch (Err) {
                    toast.error(Err.message)
                }
            }
        })

    }
    return (
        <Box p={2} pt={1} position='relative' >
            <Box height='100%'>
                <AssessmentBackdrop open={cbd} title="processing request..." />
            </Box>
            {inputState?.done_rate ? <Typography variant="body1" color="error" gutterBottom align='center'>Marked as 'Rated' (Viewing)</Typography> : ''}
            <Typography variant="body1" gutterBottom sx={{ bgcolor: 'primary.main', p: .5, color: '#fff' }}>Rating as: {data?.type === 'hr' ? 'Human resource rater' : data?.type === 'im' ? 'Immediate Head' : data?.type === 'nlh' ? 'Next Level Head' : ''}</Typography>
            <Box display='flex' gap={2} mt={2}>
                <TextField
                    label="Candidate name"
                    value={inputState?.fname + ' ' + inputState?.mname + ' ' + inputState?.lname}
                    fullWidth
                />
                <TextField
                    label="Position applied for"
                    value={inputState?.position_name}
                    fullWidth
                />
                <TextField
                    label="Area of assignment"
                    value={inputState?.dept_title}
                    fullWidth
                />
            </Box>
            <Box>
                <Box display='flex' mt={1} flexDirection={{ xs: 'column', md: 'row' }}>
                    <Typography sx={{ border: `1px solid #3D3D3D`, flex: 1, px: 1 }} variant="body1" color="initial">Scale:</Typography>
                    <Typography sx={{ border: `1px solid #3D3D3D`, flex: 1, px: 1 }} variant="body1" color="initial">5 - Very strong</Typography>
                    <Typography sx={{ border: `1px solid #3D3D3D`, flex: 1, px: 1 }} variant="body1" color="initial">4 - Strong</Typography>
                    <Typography sx={{ border: `1px solid #3D3D3D`, flex: 1, px: 1 }} variant="body1" color="initial">3 - Acceptable</Typography>
                    <Typography sx={{ border: `1px solid #3D3D3D`, flex: 1, px: 1 }} variant="body1" color="initial">2 - Weak</Typography>
                    <Typography sx={{ border: `1px solid #3D3D3D`, flex: 1, px: 1 }} variant="body1" color="initial">1 - Very Weak</Typography>
                </Box>
                <Typography variant="body1" color="initial" gutterBottom mt={2}>PART 1: Qualifications and competencies</Typography>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="mpr interviewee table" size='small'>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body1" color="initial">Education and Experience</Typography>
                                    <Typography variant="body2" color="#526D82" align='justify'>Appropriate education qualifications or training for the position applied for;
                                        Acquired similar skills or qualifications through past work experiences (Check for employment gaps)</Typography>
                                </TableCell>
                                <TableCell width="40%" align='right'>
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Rating</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            onChange={e => rateForm('education_experience', e.target.value)}
                                            value={inputState?.education_experience}
                                        >
                                            <FormControlLabel value={5} control={<Radio />} label="5" />
                                            <FormControlLabel value={4} control={<Radio />} label="4" />
                                            <FormControlLabel value={3} control={<Radio />} label="3" />
                                            <FormControlLabel value={2} control={<Radio />} label="2" />
                                            <FormControlLabel value={1} control={<Radio />} label="1" />
                                        </RadioGroup>
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body1" color="initial">Job Knowledge and competencies (Technical Qualifications)</Typography>
                                    <Typography variant="body2" color="#526D82" align='justify'>Appropriate education qualifications or training for the position applied for;
                                        Acquired similar skills or qualifications through past work experiences (Check for employment gaps)</Typography>
                                </TableCell>
                                <TableCell width="40%" align='right'>
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Rating</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            onChange={e => rateForm('competencies', e.target.value)}
                                            value={inputState?.competencies}
                                        >
                                            <FormControlLabel value={5} control={<Radio />} label="5" />
                                            <FormControlLabel value={4} control={<Radio />} label="4" />
                                            <FormControlLabel value={3} control={<Radio />} label="3" />
                                            <FormControlLabel value={2} control={<Radio />} label="2" />
                                            <FormControlLabel value={1} control={<Radio />} label="1" />
                                        </RadioGroup>
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body1" color="initial">Integirty and Professionalism</Typography>
                                    <Typography variant="body2" color="#526D82" align='justify'>Being honest and having strong moral principles; moral uprigtness. It is generally a personal choice to hold oneself to consistnent moral and ethical standards.</Typography>
                                </TableCell>
                                <TableCell width="40%" align='right'>
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Rating</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            value={inputState?.integrity_professionalism}
                                            onChange={e => rateForm('integrity_professionalism', e.target.value)}
                                        >
                                            <FormControlLabel value={5} control={<Radio />} label="5" />
                                            <FormControlLabel value={4} control={<Radio />} label="4" />
                                            <FormControlLabel value={3} control={<Radio />} label="3" />
                                            <FormControlLabel value={2} control={<Radio />} label="2" />
                                            <FormControlLabel value={1} control={<Radio />} label="1" />
                                        </RadioGroup>
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body1" color="initial">Customer-Centered Service</Typography>
                                    <Typography variant="body2" color="#526D82" align='justify'>The candidate demonstrate the knowledge and skills to create a positive customer or experience/interaction necessary forthis position.</Typography>
                                </TableCell>
                                <TableCell width="40%" align='right'>
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Rating</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            value={inputState?.customer_centered_service}
                                            onChange={e => rateForm('customer_centered_service', e.target.value)}
                                        >
                                            <FormControlLabel value={5} control={<Radio />} label="5" />
                                            <FormControlLabel value={4} control={<Radio />} label="4" />
                                            <FormControlLabel value={3} control={<Radio />} label="3" />
                                            <FormControlLabel value={2} control={<Radio />} label="2" />
                                            <FormControlLabel value={1} control={<Radio />} label="1" />
                                        </RadioGroup>
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body1" color="initial">Passion for Excellence (General Appearance and Confidence)</Typography>
                                    <Typography variant="body2" color="#526D82" align='justify'>Creates an excellent appearance; a very likeable person; shows determination and confidence; high interest level in the desired position.</Typography>
                                </TableCell>
                                <TableCell width="40%" align='right'>
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Rating</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            value={inputState?.passion_excellence}
                                            onChange={e => rateForm('passion_excellence', e.target.value)}
                                        >
                                            <FormControlLabel value={5} control={<Radio />} label="5" />
                                            <FormControlLabel value={4} control={<Radio />} label="4" />
                                            <FormControlLabel value={3} control={<Radio />} label="3" />
                                            <FormControlLabel value={2} control={<Radio />} label="2" />
                                            <FormControlLabel value={1} control={<Radio />} label="1" />
                                        </RadioGroup>
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body1" color="initial">Communication</Typography>
                                    <Typography variant="body2" color="#526D82" align='justify'>The ability to convey articulate information effectively in both verbal and non-verbal communication skills.</Typography>
                                </TableCell>
                                <TableCell width="40%" align='right'>
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Rating</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            value={inputState?.communication}
                                            onChange={e => rateForm('communication', e.target.value)}
                                        >
                                            <FormControlLabel value={5} control={<Radio />} label="5" />
                                            <FormControlLabel value={4} control={<Radio />} label="4" />
                                            <FormControlLabel value={3} control={<Radio />} label="3" />
                                            <FormControlLabel value={2} control={<Radio />} label="2" />
                                            <FormControlLabel value={1} control={<Radio />} label="1" />
                                        </RadioGroup>
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body1" color="initial">Leadership Ability</Typography>
                                    <Typography variant="body2" color="#526D82" align='justify'>Demonstrate the leadership skills necessary for the position; high potentials.</Typography>
                                </TableCell>
                                <TableCell width="40%" align='right'>
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Rating</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            value={inputState?.leadership_ability}
                                            onChange={e => rateForm('leadership_ability', e.target.value)}
                                        >
                                            <FormControlLabel value={5} control={<Radio />} label="5" />
                                            <FormControlLabel value={4} control={<Radio />} label="4" />
                                            <FormControlLabel value={3} control={<Radio />} label="3" />
                                            <FormControlLabel value={2} control={<Radio />} label="2" />
                                            <FormControlLabel value={1} control={<Radio />} label="1" />
                                        </RadioGroup>
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body1" color="initial">Synergy</Typography>
                                    <Typography variant="body2" color="#526D82" align='justify'>the ability to work well with others. willingness to cooperate; a team player.</Typography>
                                </TableCell>
                                <TableCell width="40%" align='right'>
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Rating</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            value={inputState?.synergy}
                                            onChange={e => rateForm('synergy', e.target.value)}
                                        >
                                            <FormControlLabel value={5} control={<Radio />} label="5" />
                                            <FormControlLabel value={4} control={<Radio />} label="4" />
                                            <FormControlLabel value={3} control={<Radio />} label="3" />
                                            <FormControlLabel value={2} control={<Radio />} label="2" />
                                            <FormControlLabel value={1} control={<Radio />} label="1" />
                                        </RadioGroup>
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body1" color="initial">Potential and Role Fitness</Typography>
                                    <Typography variant="body2" color="#526D82" align='justify'>The candidate's overall potential and fitness to the role and the organization</Typography>
                                </TableCell>
                                <TableCell width="40%" align='right'>
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Rating</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            value={inputState.role_fitness}
                                            onChange={e => rateForm('role_fitness', e.target.value)}
                                        >
                                            <FormControlLabel value={5} control={<Radio />} label="5" />
                                            <FormControlLabel value={4} control={<Radio />} label="4" />
                                            <FormControlLabel value={3} control={<Radio />} label="3" />
                                            <FormControlLabel value={2} control={<Radio />} label="2" />
                                            <FormControlLabel value={1} control={<Radio />} label="1" />
                                        </RadioGroup>
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body1" color="initial">Overall Assessment Rating</Typography>
                                </TableCell>
                                <TableCell width="40%" align='right'>
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Rating</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            value={inputState?.overall_rating}
                                            onChange={e => rateForm('overall_rating', e.target.value)}
                                        >
                                            <FormControlLabel value={5} control={<Radio />} label="5" />
                                            <FormControlLabel value={4} control={<Radio />} label="4" />
                                            <FormControlLabel value={3} control={<Radio />} label="3" />
                                            <FormControlLabel value={2} control={<Radio />} label="2" />
                                            <FormControlLabel value={1} control={<Radio />} label="1" />
                                        </RadioGroup>
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box mt={2} display='flex' gap={1}>
                    <TextField
                        id=""
                        label="POTENTIAL STRENGHTS"
                        multiline
                        rows={4}
                        fullWidth
                        value={inputState.potential_strength}
                        onChange={e => rateFormText('potential_strength', e.target.value)}
                    />
                    <TextField
                        id=""
                        label="RED FLAGS/ CONCERNS"
                        multiline
                        rows={4}
                        fullWidth
                        value={inputState.red_flags}
                        onChange={e => rateFormText('red_flags', e.target.value)}
                    />
                    <Box minWidth={{ xs: '25rem', md: '25rem' }}>
                        <FormControl>
                            <FormLabel id="demo-radio-buttons-group-label">Other remarks</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                name="radio-buttons-group-other-remarks"
                                value={inputState?.remarks}
                                onChange={e => rateForm('remarks', e.target.value)}
                            >
                                <FormControlLabel value={1} control={<Radio />} label="Passed, For hiring" />
                                <FormControlLabel value={2} control={<Radio />} label="For pooling / Comparison" />
                                <FormControlLabel value={3} control={<Radio />} label="Failed Assessment" />
                            </RadioGroup>
                        </FormControl>
                        <TextField
                            id=""
                            label="OTHER REMARKS"
                            multiline
                            value={inputState?.other_remarks}
                            onChange={e => rateFormText('other_remarks', e.target.value)}
                            rows={2}
                            fullWidth
                        />
                    </Box>
                </Box>
                {inputState?.done_rate ? null : (
                    <Box display='flex' justifyContent='flex-end' pt={2}>
                        <Button variant="contained" startIcon={<ArrowForward />} sx={{ borderRadius: '2rem' }} onClick={handleSubmit}>Submit updates as Final rating</Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default React.memo(InterviewAssessmentForm);