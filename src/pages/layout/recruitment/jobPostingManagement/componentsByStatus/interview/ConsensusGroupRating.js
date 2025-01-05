import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box'

const ConsensusGroupRating = ({ consensusStatus, printData, defaultList }) => {
    console.log('defaultList',defaultList)
    console.log('printdata',printData)
    const theme = createTheme({
        typography: {
            fontSize: 10,
        },
    });

    const [componentPrintData, setComponentPrintData] = useState([])

    useEffect(() => {
        let newPrintData = printData?.summary?.map((item, index) => {
            let total = 0;
            // use default list prop to collect the fullname 
            let name = defaultList.filter((x, i) => x?.profile_id === item.profile_id)

            total += item.coaching_result
            total += item.delivering_service
            total += item.exemplifying_integrity
            total += item.high_performance_organization
            total += item.leading_change
            total += item.solving_problems
            total += item.strategic_creativity
            total += item.working_relationship

            return { ...item, total: total, ave: total / 8, name: name[0]?.fname + ' ' + name[0]?.mname + ' ' + name[0]?.lname }
        })
        setComponentPrintData(newPrintData)
    }, [printData])

    return (
        <div style={{ width: '100%',overflowY:'scroll',height:'100%' }}>
            <ThemeProvider theme={theme}>
                <Typography variant="body1" color="initial" align="center" sx={{ fontSize: '12px' }}>BEHAVIORAL-BASED INTERVIEW RESULT</Typography>
                <Typography variant="body1" color="initial" align="center" sx={{ fontSize: '12px' }}>CONSENSUS GROUP RATING</Typography>

                <TableContainer sx={{ mb: '10px' }}>
                    <Table aria-label="simple table" size="small">
                        <TableBody>
                            <TableRow>
                                <TableCell align="left" colSpan={10} sx={{ border: '1px solid black', bgcolor: '#5C5C5C' }}>
                                    <Typography variant="body1" color="#fff">Date of Interview: 21 March 2022</Typography>
                                </TableCell>
                                <TableCell align="right" colSpan={5} sx={{ border: '1px solid black' }}>
                                    <Typography variant="body1" color="initial">Last Day f or Final Action: 15 November 2022</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="center" rowSpan={3} sx={{ border: '1px solid black', bgcolor: '#BEBEBE' }}>No</TableCell>
                                <TableCell align="center" sx={{ border: '1px solid black', bgcolor: '#BEBEBE' }} rowSpan={2}>NAME</TableCell>
                                <TableCell align="center" colSpan={10} sx={{ border: '1px solid black', bgcolor: '#BEBEBE' }}>COMPETENCIES</TableCell>
                                <TableCell align="center" rowSpan={3} sx={{ border: '1px solid black', bgcolor: '#BEBEBE', }}>Ranking</TableCell>
                                <TableCell align="center" rowSpan={3} sx={{ border: '1px solid black', bgcolor: '#BEBEBE', }}>Photo</TableCell>
                                <TableCell align="center" rowSpan={3} sx={{ border: '1px solid black', bgcolor: '#BEBEBE', }}>Appointing Authority's SIGNATURE</TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell align="center" sx={{ border: '1px solid black', bgcolor: '#5C5C5C', color: '#fff', }} colSpan={2} >CORE</TableCell>
                                <TableCell align="center" sx={{ border: '1px solid black', bgcolor: '#5C5C5C', color: '#fff', }} colSpan={6} >FUNCTIONAL</TableCell>
                                <TableCell align="center" sx={{ border: '1px solid black', bgcolor: '#BEBEBE', }} rowSpan={2}>TOTAL</TableCell>
                                <TableCell align="center" sx={{ border: '1px solid black', bgcolor: '#BEBEBE', }} rowSpan={2}>AVERAGE</TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell align="left" sx={{ border: '1px solid black', }} >{printData?.vacancy_info?.position_title} (item No. {printData?.vacancy_info?.plantilla_no}) {printData?.vacancy_info?.dept_title}</TableCell>
                                <TableCell align="center" sx={{ border: '1px solid black', }} >EL</TableCell>
                                <TableCell align="center" sx={{ border: '1px solid black', }} >SP</TableCell>
                                <TableCell align="center" sx={{ border: '1px solid black', }} >DSE</TableCell>
                                <TableCell align="center" sx={{ border: '1px solid black', }} >BCIWR</TableCell>
                                <TableCell align="center" sx={{ border: '1px solid black', }} >TSC</TableCell>
                                <TableCell align="center" sx={{ border: '1px solid black', }} >CNHPO</TableCell>
                                <TableCell align="center" sx={{ border: '1px solid black', }} >LC</TableCell>
                                <TableCell align="center" sx={{ border: '1px solid black', }} >MPCR</TableCell>
                            </TableRow>
                            {componentPrintData && componentPrintData.map((item, index) => (
                                <TableRow sx={{ border: '1px solid black' }}>
                                    {Array.from(Array(15)).map((x, i) => (
                                        <TableCell align="center"
                                            sx={{ border: '1px solid black' }}
                                        >
                                            {i === 0 && index + 1}
                                            {i === 1 && (<Typography variant='body2' sx={{}}>{item?.name}</Typography>)}
                                            {i === 2 && <Typography sx={{}}>{item?.exemplifying_integrity?.toFixed(2)}</Typography>}
                                            {i === 3 && <Typography sx={{}}>{item?.solving_problems?.toFixed(2)}</Typography>}
                                            {i === 4 && <Typography sx={{}}>{item?.delivering_service?.toFixed(2)}</Typography>}
                                            {i === 5 && <Typography sx={{}}>{item?.working_relationship?.toFixed(2)}</Typography>}
                                            {i === 6 && <Typography sx={{}}>{item?.strategic_creativity?.toFixed(2)}</Typography>}
                                            {i === 7 && <Typography sx={{}}>{item?.high_performance_organization?.toFixed(2)}</Typography>}
                                            {i === 8 && <Typography sx={{}}>{item?.leading_change?.toFixed(2)}</Typography>}
                                            {i === 9 && <Typography sx={{}}>{item?.coaching_result?.toFixed(2)}</Typography>}
                                            {i === 10 && <Typography sx={{}}>{item?.total.toFixed(2)}</Typography>}
                                            {i === 11 && <Typography sx={{}}>{item?.ave.toFixed(2)}</Typography>}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* <div style={{ padding: '0px 30px' }}>
                    <Box display="flex">
                        <Box sx={{ flex: 1 }}>
                            <Box display="flex">
                                <Typography variant="body1" color="initial" sx={{ flex: 1 }}>Prepared by:</Typography>
                                <Box display="flex" sx={{ flex: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
                                    <Typography color="initial" align="center" sx={{ mt: '50px' }} lineHeight={1} >ANNE MAY PAMELA K. PERLA</Typography>
                                    <Typography color="initial" align="center" lineHeight={1} >Administrative Officer IV</Typography>
                                    <Typography variant="body2" color="initial" align="center" lineHeight={1} >(Human Resource Management Offier II)</Typography>
                                    <Typography variant="body2" color="initial" align="center" lineHeight={1} >Secretariat, HRMPSB</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Box display="flex">
                                <Typography variant="body1" color="initial" sx={{ flex: 1 }}>Certified correct:</Typography>
                                <Box display="flex" sx={{ flex: 3, alignItems: 'center', flexDirection: 'column' }}>
                                    <Typography variant="body2" color="initial" align="center" sx={{ mt: '50px' }} lineHeight={1} >OWEN M. DUCENA</Typography>
                                    <Typography variant="body2" color="initial" align="center" lineHeight={1} >City Government Department Head II</Typography>
                                    <Typography variant="body2" color="initial" align="center" lineHeight={1} >(City  Human REsource Management Officer)</Typography>
                                    <Typography variant="body2" color="initial" align="center" lineHeight={1} >Member, HRMPSB</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Typography variant="body1" color="initial" align='center' sx={{ mt: '5px', mb: '30px' }}>Attested by:</Typography>
                    <Box display="flex">
                        <Box sx={{ flex: 1 }}>
                            <Box display="flex">
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" color="initial" lineHeight={1} >ATTY. NOEL EPHRAIM R. ANTIGUA</Typography>
                                    <Typography variant="body2" color="initial" lineHeight={1} >City Administrator</Typography>
                                    <Typography variant="body2" color="initial" lineHeight={1} >Representative, HRMPSB Chairperson</Typography>
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" color="initial" align="center" sx={{ mt: '50px' }} lineHeight={1} >SWEET ANGELINE R. DEQUINA</Typography>
                                    <Typography variant="body2" color="initial" align="center" lineHeight={1} >Administrative Assistant II (HRMA)</Typography>
                                    <Typography variant="body2" color="initial" align="center" lineHeight={1} >BCGEA 1st Level Representative</Typography>
                                    <Typography variant="body2" color="initial" align="center" lineHeight={1} >Member, HRMPSB</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box display="flex" sx={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                            <Typography variant="body1" color="initial" >Approved by:</Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Box display="flex">
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" color="initial" align="center" sx={{ mt: '50px' }}>MILa G. BUSICO</Typography>
                                    <Typography variant="body2" color="initial" align="center" >City Administrator</Typography>
                                    <Typography variant="body2" color="initial" align="center" >Representative, HRMPSB Chairperson</Typography>
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" color="initial" align="center" lineHeight={1} >ARMEL M. ODVINA</Typography>
                                    <Typography variant="body2" color="initial" align="center" lineHeight={1} >Administrative Officer V</Typography>
                                    <Typography variant="body2" color="initial" align="center" lineHeight={1} >(Human Resource Management Officer III)</Typography>
                                    <Typography variant="body2" color="initial" align="center" lineHeight={1} >Representative, CHRMO</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ mt: '50px' }}>
                        <Box>
                            <Typography variant="body2" color="initial" align="center" lineHeight={1} >ENGR. RONNIE VICENTE C. LAGNADA</Typography>
                            <Typography variant="body2" color="initial" align="center" lineHeight={1}>City Mayor</Typography>
                            <Typography variant="body2" color="initial" align="center" lineHeight={1}>Chairperson, HRMPSB</Typography>
                        </Box>
                    </Box>
                </div> */}
            </ThemeProvider>
        </div>
    );
};

export default React.memo(ConsensusGroupRating);