import React, { useEffect, useState, useRef } from 'react';
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


const data = [
    {
        title: 'EXEMPLIFYING INTEGRITY',
        definition: "The ability to show by example in the faithful adherence to moral and ethical standards. It illutrates a person's level of honesty, moral commitments, and willingness to do what is right."
    },
    {
        title: 'SOLVING PROBLEMS AND DECISION MAKING',
        defintion: "The ability to show by example in the faithful adherence to moral and ethical standards. It illutrates a person's level of honesty, moral commitments, and willingness to do what is right."
    },
    {
        title: 'DELIVERING SERVICE EXCELLENCE',
        definition: "	The ability to show by example in the faithful adherence to moral and ethical standards. It illutrates a person's level of honesty, moral commitments, and willingness to do what is right."
    },
    {
        title: 'BUILDING COLLABORATIVE, INCLUSIVE WORKING RELATIONSHIPS',
        definition: "The ability to show by example in the faithful adherence to moral and ethical standards. It illutrates a person's level of honesty, moral commitments, and willingness to do what is right."
    },
    {
        title: 'THINKING STRATEGICALLY AND CREATIVELY',
        definition: "The ability to show by example in the faithful adherence to moral and ethical standards. It illutrates a person's level of honesty, moral commitments, and willingness to do what is right."
    },
    {
        title: 'CREATING AND NURTURING A HIGH PERFORMING ORGANIZATION',
        definition: "The ability to show by example in the faithful adherence to moral and ethical standards. It illutrates a person's level of honesty, moral commitments, and willingness to do what is right."
    },
    {
        title: 'LEADING CHANGE',
        definition: "The ability to show by example in the faithful adherence to moral and ethical standards. It illutrates a person's level of honesty, moral commitments, and willingness to do what is right."
    },
    {
        title: 'MANAGING PERFORMANCE AND COACHINH RESULTS',
        definition: "The ability to show by example in the faithful adherence to moral and ethical standards. It illutrates a person's level of honesty, moral commitments, and willingness to do what is right."
    }
]

const ConcensusRatingForm = ({ consensusStatus, printData }) => {
    console.log('SAADAD',consensusStatus)
    const firstRenderRef = useRef(true)
    const [composition, setComposition] = useState('')
    const [total, setTotal] = useState('')
    const [ave, setAve] = useState('')
    useEffect(() => {
        setComposition(consensusStatus.sort((a, b) => { // sort to determine whos the current chairman of the panel
            if (a.is_chairman > b.is_chairman) {
                return -1;
            }
            if (a.is_chairman < b.is_chairman) {
                return 1;
            }
            return 0;
        }))
    }, [consensusStatus])

    useEffect(() => {
        if (!firstRenderRef.current) {
            let exemplifying_integrity = 0
            let solving_problems = 0
            let delivering_service = 0
            let working_relationship = 0
            let strategic_creativity = 0
            let high_performance_organization = 0
            let leading_change = 0
            let coaching_result = 0
            composition.forEach((item, i) => {
                console.log(item)
                exemplifying_integrity = exemplifying_integrity + Number(item?.exemplifying_integrity) / composition.length
                solving_problems = solving_problems + Number(item?.solving_problems) / composition.length
                delivering_service = delivering_service + Number(item?.delivering_service) / composition.length
                working_relationship = working_relationship + Number(item?.working_relationship) / composition.length
                strategic_creativity = strategic_creativity + Number(item?.strategic_creativity) / composition.length
                high_performance_organization = high_performance_organization + Number(item?.high_performance_organization) / composition.length
                leading_change = leading_change + Number(item?.leading_change) / composition.length
                coaching_result = coaching_result + Number(item?.coaching_result) / composition.length
            })
            let totalObj = {
                exemplifying_integrity: exemplifying_integrity,
                solving_problems: solving_problems,
                delivering_service: delivering_service,
                working_relationship: working_relationship,
                strategic_creativity: strategic_creativity,
                high_performance_organization: high_performance_organization,
                leading_change: leading_change,
                coaching_result: coaching_result,
            }
            let ave = 0
            Object.values(totalObj).forEach((item, i) => {
                ave = ave + item
            })
            setTotal(totalObj)
            setAve(ave / 8)
        }
        else
            firstRenderRef.current = false
    }, [composition])
    return (
        <div style={{ padding: '40px' }}>
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
                <Typography variant="h6" color="initial" align='center' fontWeight={700} letterSpacing={1}>CONCENSUS RATING FORM</Typography>
            </Box>
            <TableContainer sx={{ border: '1px solid black' }}>
                <Table aria-label="simple table" size="small">
                    <TableBody>
                        <TableRow>
                            <TableCell align="left" sx={{ border: '1px solid black' }} colSpan={6}>
                                <Box>
                                    <Typography variant="body1" color="initial">Applicant's Name: {printData?.profile?.fname} {printData?.profile?.mname} {printData?.profile?.lname}</Typography>
                                    <Typography variant="body1" color="initial">Position Applied: {printData?.position_title}</Typography>
                                    <Typography variant="body1" color="initial">Item Number: {printData?.plantilla_no}</Typography>
                                    <Typography variant="body1" color="initial">Office:</Typography>
                                </Box>
                            </TableCell>
                            <TableCell align="left" sx={{ border: '1px solid black', verticalAlign: 'top' }} colSpan={1}>
                                <Typography variant="body1" color="initial">Date of Interview:</Typography>
                                <Typography variant="body1" color="initial">{printData?.interview_date}</Typography>

                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="justify" sx={{ border: '1px solid black' }} colSpan={7}>
                                <b>Instructions: </b> Transfer each interviewer's competency rating onto this form. A consensus discussion must occur with each panel
                                member justifying his or her rating. Any changes to the individual ratings during consensus discussion should be initialed by the panel member. A final group
                                consensus rating must be entered for each competency.
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="center" colSpan={1} rowSpan={2} sx={{ border: '1px solid black' }}>
                                Competency
                            </TableCell>
                            <TableCell align="center" colSpan={5} rowSpan={1} width="20%" sx={{ border: '1px solid black' }}>
                                Panelists' Individual Ratings
                            </TableCell>
                            <TableCell align="center" colSpan={5} rowSpan={2} sx={{ border: '1px solid black' }}>
                                Consensus Group Rating
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ border: '1px solid black' }} >
                                (1)
                            </TableCell >
                            <TableCell sx={{ border: '1px solid black' }} >
                                (2)
                            </TableCell>
                            <TableCell sx={{ border: '1px solid black' }} >
                                (3)
                            </TableCell>
                            <TableCell sx={{ border: '1px solid black' }}  >
                                (4)
                            </TableCell>
                            <TableCell sx={{ border: '1px solid black' }} >
                                (5)
                            </TableCell>
                        </TableRow>
                        {data.map((item, index) => (
                            <TableRow>
                                <TableCell align='left' sx={{ border: '1px solid black' }} >{index === 0 ? 'Exemplifying Integrity' : index === 1 ? 'Solving Problems and Decision Making' : index === 2 ? 'Delivering Service Excellence' : index === 3 ? 'Building Collaborative, Inclusive Working Replationships' : index === 4 ? 'Thinking Strategically and Creatively' : index === 5 ? 'Creating and Nurturing a High Performing Organization' : index === 6 ? 'Leading Change' : index === 7 ? 'Managing Performance' : ''}</TableCell>
                                {Array.from(Array(5)).map((x, i) => (
                                    <TableCell align='center' sx={{ border: '1px solid black' }} >
                                        {index === 0 && composition[i]?.exemplifying_integrity}
                                        {index === 1 && composition[i]?.solving_problems}
                                        {index === 2 && composition[i]?.delivering_service}
                                        {index === 3 && composition[i]?.working_relationship}
                                        {index === 4 && composition[i]?.strategic_creativity}
                                        {index === 5 && composition[i]?.high_performance_organization}
                                        {index === 6 && composition[i]?.leading_change}
                                        {index === 7 && composition[i]?.coaching_result}
                                    </TableCell>
                                ))}
                                <TableCell align='center' sx={{ border: '1px solid black' }} >
                                    {index === 0 && total?.exemplifying_integrity?.toFixed(2)}
                                    {index === 1 && total?.solving_problems?.toFixed(2)}
                                    {index === 2 && total?.delivering_service?.toFixed(2)}
                                    {index === 3 && total?.working_relationship?.toFixed(2)}
                                    {index === 4 && total?.strategic_creativity?.toFixed(2)}
                                    {index === 5 && total?.high_performance_organization?.toFixed(2)}
                                    {index === 6 && total?.leading_change?.toFixed(2)}
                                    {index === 7 && total?.coaching_result?.toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={6} align="right" sx={{ border: '1px solid black' }}>
                                Average
                            </TableCell>
                            <TableCell align="center" sx={{ border: '1px solid black' }}>
                                {ave && ave?.toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={7} align="left" sx={{ border: '1px solid black' }}>
                                <Typography variant="body1" color="initial"><b>COMMENTS</b></Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={4} align="left" sx={{ border: '1px solid black' }}>
                                <Typography variant="body1" color="initial">Pannel Composition</Typography>
                            </TableCell>
                            <TableCell colSpan={3} align="left" sx={{ border: '1px solid black' }}>
                                <Typography variant="body1" color="initial">Signature</Typography>
                            </TableCell>
                        </TableRow>
                        {Array.from(Array(5)).map((x2, i2) => (
                            <TableRow>
                                <TableCell colSpan={4} align="left" sx={{ border: '1px solid black' }}>
                                    <Typography variant="body1" color="initial"> {i2 === 0 ? 'Chairperson # 1: ' : `Member #${i2 + 1}: `}{composition[i2]?.fname} {composition[i2]?.mname} {composition[i2]?.lname}</Typography>
                                </TableCell>
                                <TableCell colSpan={3} align="left" sx={{ border: '1px solid black' }}>
                                    <Typography variant="body1" color="initial"></Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default React.memo(ConcensusRatingForm);