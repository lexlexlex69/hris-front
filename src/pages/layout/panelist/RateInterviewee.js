import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton'

import axios from 'axios';
import { toast } from 'react-toastify';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ExpandMore from '@mui/icons-material/ExpandMore';

import CustomBackdrop from './CustomBackdrop';
import Ratingdone from '../../../assets/img/done_rating.svg'






const RateInterviewee = ({ data, ratingDialogRow }) => {
    const [backdropState, setBackdropState] = useState(false)
    const [loader, setLoader] = useState(true)
    const [ratingData, setRatingData] = useState([
        {
            title: 'EXEMPLIFYING INTEGRITY',
            definition: 'The ability to show by example in the faithful adherence to moral and ethical standards. It illutrates a person\'s level of honesty, moral commitments, and willingness to do what is right.',
            radioName: 'exemplfying',
        },
        {
            title: 'SOLVING PROBLEMS AND DECISION MAKING',
            definition: 'The ability to show by example in the faithful adherence to moral and ethical standards. It illutrates a person\'s level of honesty, moral commitments, and willingness to do what is right.',
            radioName: 'solving'
        },
        {
            title: 'DELIVERING SERVICE EXCELLENCE',
            definition: 'The ability to show by example in the faithful adherence to moral and ethical standards. It illutrates a person\'s level of honesty, moral commitments, and willingness to do what is right.',
            radioName: 'service'
        },
        {
            title: 'BUILDING COLLABORATIVE, INCLUSIVE WORKING RELATIONSHIPS',
            definition: 'The ability to show by example in the faithful adherence to moral and ethical standards. It illutrates a person\'s level of honesty, moral commitments, and willingness to do what is right.',
            radioName: 'relationship'
        },
    ])

    const [actualRatingData, setActualRatingData] = useState({
        profile_id: '',
        vacancy_id: '',
        panel_id: '',
        exemplifying_integrity: '',
        exemplifying_integrity_situation: '',
        exemplifying_integrity_action: '',
        exemplifying_integrity_result: '',
        solving_problems: '',
        solving_problems_situation: '',
        solving_problems_action: '',
        solving_problems_result: '',
        delivering_service: '',
        delivering_service_situation: '',
        delivering_service_action: '',
        delivering_service_result: '',
        working_relationship: '',
        working_relationship_situation: '',
        working_relationship_action: '',
        working_relationship_result: '',
        average: '',
        is_consolidated: ''
    })
    const [open, setOpen] = useState([
        { value: false },
        { value: false },
        { value: false },
        { value: false },
    ])

    const handleClick = (index) => {
        console.log(index)
        let newOpen = open.map((item, i) => {
            if (index === i) {
                return { ...item, value: !item.value }
            }
            else
                return item
        })
        setOpen(newOpen)
    };

    const handleChange = (e) => {
        setActualRatingData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (index) => {
        let tempStore = {}
        if (index === 0) {
            tempStore = {
                situation: actualRatingData.exemplifying_integrity_situation,
                action: actualRatingData.exemplifying_integrity_action,
                result: actualRatingData.exemplifying_integrity_result,
                data: actualRatingData.exemplifying_integrity
            }
        }
        else if (index === 1) {
            tempStore = {
                situation: actualRatingData.solving_problems_situation,
                action: actualRatingData.solving_problems_action,
                result: actualRatingData.solving_problems_result,
                data: actualRatingData.solving_problems
            }
        }
        else if (index === 2) {
            tempStore = {
                situation: actualRatingData.delivering_service_situation,
                action: actualRatingData.delivering_service_action,
                result: actualRatingData.delivering_service_result,
                data: actualRatingData.delivering_service
            }
        }
        else if (index === 3) {
            tempStore = {
                situation: actualRatingData.working_relationship_situation,
                action: actualRatingData.working_relationship_action,
                result: actualRatingData.working_relationship_result,
                data: actualRatingData.working_relationship
            }
        }
        tempStore.panel_id = ratingDialogRow.hris_job_interview_panelist_id
        tempStore.vacancy_id = ratingDialogRow.hris_job_vacancies_id
        tempStore.profile_id = data.profile_id
        tempStore.index = index

        setBackdropState(true)

        let res = await axios.post(`/api/recruitment/interview/employee/setIntervieweeRating`, tempStore)

        setBackdropState(false)
        if (res.data.status === 200) {
            let message = index === 0 ? 'EXEMPLIFYING INTEGRITY' : index === 1 ? 'SOLVING PROBLEMS AND DECISION MAKING' : index === 2 ? 'DELIVERING SERVICE EXCELLENCE' : index === 3 ? 'BUILDING COLLABORATION, INCLUSIVE WORKING RELATIONSHIPS' : null // index === 4 ? 'THINKING STRATEGICALLY AND CREATIVELY' : index === 5 ? 'CREATING AND NURTURING A HIGH PERFORMING ORGANIZATION' : index === 6 ? 'LEADING CHANGE' : index === 7 ? 'MANAGING PERFORMANCE AND COACHING RESULTS' : ''
            toast.success(message + ' Updated!')
        }
        if (res.data.status === 500) {
            toast.error(res.data.message)
        }

        console.log(res)
    }

    const getIntervieweeDetails = async () => {
        let res = await axios.get(`/api/recruitment/interview/employee/getIntervieweeRating?vacancy_id=${ratingDialogRow.hris_job_vacancies_id}&&panel_id=${ratingDialogRow.hris_job_interview_panelist_id}&&profile_id=${data.profile_id}`)
        console.log(res)
        setLoader(false)
        if (res.data.status === 200) {
            setActualRatingData({
                profile_id: '',
                vacancy_id: '',
                panel_id: '',
                exemplifying_integrity: res.data.data.exemplifying_integrity,
                exemplifying_integrity_situation: res.data.data.exemplifying_integrity_situation,
                exemplifying_integrity_action: res.data.data.exemplifying_integrity_action,
                exemplifying_integrity_result: res.data.data.exemplifying_integrity_result,
                solving_problems: res.data.data.solving_problems,
                solving_problems_situation: res.data.data.solving_problems_situation,
                solving_problems_action: res.data.data.solving_problems_action,
                solving_problems_result: res.data.data.solving_problems_result,
                delivering_service: res.data.data.delivering_service,
                delivering_service_situation: res.data.data.delivering_service_situation,
                delivering_service_action: res.data.data.delivering_service_action,
                delivering_service_result: res.data.data.delivering_service_result,
                working_relationship: res.data.data.working_relationship,
                working_relationship_situation: res.data.data.working_relationship_situation,
                working_relationship_action: res.data.data.working_relationship_action,
                working_relationship_result: res.data.data.working_relationship_result,
                average: '',
                is_consolidated: res.data.data.is_consolidated
            })
        }
    }

    useEffect(() => {
        getIntervieweeDetails()
    }, [])

    return (
        <Container sx={{ py: 2 }}>
            <Grid container spacing={2}>
                <CustomBackdrop open={backdropState} title="please wait . . ." />
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <TextField
                        id=""
                        label="Name of Interviewee"
                        fullWidth
                        size='small'
                        value={data?.fname + ' ' + data?.mname + ' ' + data?.lname}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <TextField
                        id=""
                        label="Position Applied For"
                        fullWidth
                        size='small'
                        value={ratingDialogRow?.position_title}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <TextField
                        id=""
                        label="Name of Interviewer"
                        fullWidth
                        size='small'
                        value={ratingDialogRow?.user_information?.fname + ' ' + ratingDialogRow?.user_information?.mname + ' ' + ratingDialogRow?.user_information?.lname}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <TextField
                        id=""
                        label="Date of Interview"
                        fullWidth
                        size='small'
                        value={data?.interview_date}
                    />
                </Grid>
                <Grid md={12} lg={12} item>
                    <Typography variant="body1" align='center' fontWeight='bold' gutterBottom>BEHAVIORAL-BASED INTERVIEW (BBI) RATING</Typography>
                </Grid>
                <Grid md={12} lg={12} item>
                    {loader ? (
                        <Box display="flex" sx={{ width: '100%', px: { xs: 0, md: 10 }, flexDirection: 'column', gap: 2 }} >
                            {Array.from(Array(8)).map((item, i) => (
                                <Skeleton variant="text" width="100%" height={35} animation="pulse" />
                            ))}
                        </Box>
                    ) : (
                        <>
                            {actualRatingData.is_consolidated ? (
                                <Box sx={{ width: '100%' }}>
                                    <Alert severity='success' align="center">RATING DURATION IS FINISHED!</Alert>
                                    <Box display="flex" sx={{ justifyContent: 'center' }}>
                                        <img src={Ratingdone} width="40%" />
                                    </Box>
                                </Box>
                            ) : (
                                <List
                                    sx={{ width: '100%', bgcolor: 'bakcground.paper', borderRadius: .5, px: 1, border: '1px solid #BEBEBE' }}
                                >
                                    {ratingData && ratingData.map((item, i) => (
                                        <>
                                            <ListItemButton onClick={() => handleClick(i)}>
                                                <ListItemIcon>
                                                </ListItemIcon>
                                                <ListItemText primary={
                                                    <Box display='flex' sx={{ justifyContent: 'space-between' }}>
                                                        <Typography>{item.title}</Typography>
                                                    </Box>
                                                }
                                                    sx={{ color: '#fff', bgcolor: (i === 0 && actualRatingData.exemplifying_integrity) || (i === 1 && actualRatingData.solving_problems) || (i === 2 && actualRatingData.delivering_service) || (i === 3 && actualRatingData.working_relationship) ? 'primary.main' : 'warning.main', p: 1, borderRadius: 1 }} />
                                                {open[i].value ? <ExpandLess sx={{ color: 'primary.light' }} /> : <ExpandMore sx={{ color: 'primary.light' }} />}
                                            </ListItemButton>
                                            <Collapse in={open[i].value} timeout="auto" unmountOnExit>
                                                <List component="div" sx={{ bgcolor: '#fff', borderRadius: .5, px: 5, position: 'relative' }}>
                                                    <TableContainer component={Paper}>
                                                        <Table aria-label="simple table">
                                                            <TableBody>
                                                                <TableRow>
                                                                    <TableCell component="th" scope="row" width="20%">Definition</TableCell>
                                                                    <TableCell align="left">{item.definition}</TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell component="th" scope="row">Situation or Task/s</TableCell>
                                                                    <TableCell align="right">
                                                                        <TextField
                                                                            id=""
                                                                            label=" "
                                                                            name={i === 0 ? 'exemplifying_integrity_situation' : i === 1 ? 'solving_problems_situation' : i === 2 ? 'delivering_service_situation' : i === 3 ? 'working_relationship_situation' : null} // i === 4 ? 'strategic_creativity_situation' : i === 5 ? 'high_performance_organization_situation' : i === 6 ? 'leading_change_situation' : i === 7 ? 'coaching_result_situation' : null}
                                                                            value={i === 0 ? actualRatingData.exemplifying_integrity_situation : i === 1 ? actualRatingData.solving_problems_situation : i === 2 ? actualRatingData.delivering_service_situation : i === 3 ? actualRatingData.working_relationship_situation : null} // i === 4 ? actualRatingData.strategic_creativity_situation : i === 5 ? actualRatingData.high_performance_organization_situation : i === 6 ? actualRatingData.leading_change_situation : i === 7 ? actualRatingData.coaching_result_situation : null}
                                                                            onChange={handleChange}
                                                                            multiline
                                                                            rows={4}
                                                                            fullWidth
                                                                        />
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell component="th" scope="row">Action/s</TableCell>
                                                                    <TableCell align="right">
                                                                        <TextField
                                                                            id=""
                                                                            label=" "
                                                                            name={i === 0 ? 'exemplifying_integrity_action' : i === 1 ? 'solving_problems_action' : i === 2 ? 'delivering_service_action' : i === 3 ? 'working_relationship_action' : null} // i === 4 ? 'strategic_creativity_action' : i === 5 ? 'high_performance_organization_action' : i === 6 ? 'leading_change_action' : i === 7 ? 'coaching_result_action' : ''}
                                                                            value={i === 0 ? actualRatingData.exemplifying_integrity_action : i === 1 ? actualRatingData.solving_problems_action : i === 2 ? actualRatingData.delivering_service_action : i === 3 ? actualRatingData.working_relationship_action : null} // i === 4 ? actualRatingData.strategic_creativity_situation : i === 5 ? actualRatingData.high_performance_organization_action : i == 6 ? actualRatingData.leading_change_action : i === 7 ? actualRatingData.coaching_result_action : null}
                                                                            onChange={handleChange}
                                                                            fullWidth
                                                                            multiline
                                                                            rows={4}
                                                                        />
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell component="th" scope="row">Result/s</TableCell>
                                                                    <TableCell align="right">
                                                                        <TextField
                                                                            id=""
                                                                            label=" "
                                                                            fullWidth
                                                                            name={i === 0 ? 'exemplifying_integrity_result' : i === 1 ? 'solving_problems_result' : i === 2 ? 'delivering_service_result' : i === 3 ? 'working_relationship_result' : null} // i === 4 ? 'strategic_creativity_result' : i === 5 ? 'high_performance_organization_result' : i === 6 ? 'leading_change_result' : i === 7 ? 'coaching_result_result' : ''}
                                                                            value={i === 0 ? actualRatingData.exemplifying_integrity_result : i === 1 ? actualRatingData.solving_problems_result : i === 2 ? actualRatingData.delivering_service_result : i === 3 ? actualRatingData.working_relationship_result : null} // i === 4 ? actualRatingData.strategic_creativity_situation : i === 5 ? actualRatingData.high_performance_organization_result : i === 6 ? actualRatingData.leading_change_result : i === 7 ? actualRatingData.coaching_result_result : null}
                                                                            onChange={handleChange}
                                                                            multiline
                                                                            rows={4}
                                                                        />
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell component="th" scope="row">Rating  scale</TableCell>
                                                                    <TableCell align="right">
                                                                        <Box display='flex' sx={{ flexWrap: 'wrap', justifyContent: 'space-around' }} >
                                                                            <Typography variant="body1" color="initial">5 - Significant; </Typography>
                                                                            <Typography variant="body1" color="initial">4 - More than acceptable; </Typography>
                                                                            <Typography variant="body1" color="initial">3 - Acceptable;</Typography>
                                                                            <Typography variant="body1" color="initial">2 - Less Acceptable; </Typography>
                                                                            <Typography variant="body1" color="initial">and 1 - Not Acceptable</Typography>
                                                                        </Box>
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell component="th" scope="row">Rating</TableCell>
                                                                    <TableCell align="right">
                                                                        <Box>
                                                                            <FormControl sx={{ width: '100%' }}
                                                                            >
                                                                                <RadioGroup
                                                                                    row
                                                                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                                                                    name={i === 0 ? 'exemplifying_integrity' : i === 1 ? 'solving_problems' : i === 2 ? 'delivering_service' : i === 3 ? 'working_relationship' : null} // i === 4 ? 'strategic_creativity' : i === 5 ? 'high_performance_organization' : i === 6 ? 'leading_change' : i === 7 ? 'coaching_result' : null}
                                                                                    value={i === 0 ? actualRatingData.exemplifying_integrity : i === 1 ? actualRatingData.solving_problems : i === 2 ? actualRatingData.delivering_service : i === 3 ? actualRatingData.working_relationship : null} // i === 4 ? actualRatingData.strategic_creativity : i === 5 ? actualRatingData.high_performance_organization : i === 6 ? actualRatingData.leading_change : i === 7 ? actualRatingData.coaching_result : null}
                                                                                    onChange={handleChange}
                                                                                    sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}
                                                                                >
                                                                                    <FormControlLabel value="5" control={<Radio />} label="5" />
                                                                                    <FormControlLabel value="4" control={<Radio />} label="4" />
                                                                                    <FormControlLabel value="3" control={<Radio />} label="3" />
                                                                                    <FormControlLabel value="2" control={<Radio />} label="2" />
                                                                                    <FormControlLabel value="1" control={<Radio />} label="1" />
                                                                                </RadioGroup>
                                                                            </FormControl>
                                                                        </Box>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                    <Box display="flex" sx={{ justifyContent: 'flex-end', mt: 1 }}>
                                                        <Button variant='contained' color="primary" sx={{ borderRadius: '2rem' }} startIcon={<ThumbUpOffAltIcon />} onClick={() => handleSubmit(i)}>Rate</Button>
                                                    </Box>
                                                </List>

                                            </Collapse>
                                        </>
                                    ))}

                                </List>
                            )}
                        </>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default RateInterviewee;