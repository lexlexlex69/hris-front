import React, { useEffect, useState } from 'react';
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import BL from '../../../../../../assets/img/bl.png'
import FormsHeader1 from './header/FormsHeader1';


const PrintExamShortList = ({ data, notQualified, posInfo, examDates, signatoriesData }) => {
    const [applicants, setApplicants] = useState([])

    function groupBy(arr, property) {
        return arr.reduce(function (memo, x) {
            if (!memo[x[property]]) { memo[x[property]] = []; }
            memo[x[property]].push(x);
            return memo;
        }, {});
    }


    useEffect(() => {
        let newArr = data.concat(notQualified)
        newArr = newArr.sort(function (a, b) { return a?.exam_date < b?.exam_date })
        // group array via exam_date
        let grouped = groupBy(newArr, 'exam_date')
        // 
        // after group sort via exam_date
        Object.keys(grouped).map((item) => {
        })
        setApplicants(grouped)
    }, [data, notQualified])
    return (
        <>

            {
                Object.keys(applicants).map((item, i) => (
                    < div className='force-break'>
                        <Box width='100%' >
                            <FormsHeader1 />
                        </Box>
                        <Box sx={{ mt: '50px', px: '40px' }}>
                            <Typography variant="body1" color="initial" align="center" mt={3} mb={3}>
                                WRITTEN EXAMINATION SCHEDULE
                            </Typography>
                            <Box display='flex' flexDirection='column'>
                                <Box display='flex' justifyContent='space-between'>
                                    <Box display='flex'>
                                        <Typography mr={2}>Date: {item} </Typography>
                                        <Typography mr={2}> </Typography>
                                    </Box>
                                    <Box display='flex'>
                                        <Typography mr={2}>Mode of Examination:  </Typography>
                                        <Typography mr={2}> {examDates.find(a => a.date === item)?.mode_of_exam}</Typography>
                                    </Box>
                                </Box>
                                <Box display='flex' justifyContent='space-between'>
                                    <Box display='flex'>
                                        <Typography mr={2}>Place of Examination: {applicants[item][0]?.exam_venue}</Typography>
                                        <Typography mr={2}></Typography>
                                    </Box>
                                    <Box display='flex'>
                                        <Typography mr={2}>Type of Test: </Typography>
                                        <Typography mr={2}>{examDates.find(a => a.date === item)?.type_of_test}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box display="" sx={{ width: '90%', m: 'auto', mt: '20px' }}>
                                <TableContainer>
                                    <Table aria-label="simple table" size='small'>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>OFFICE</TableCell>
                                                <TableCell>POSITION/ITEM NO.</TableCell>
                                                <TableCell>SG LEVEL</TableCell>
                                                <TableCell>TIME</TableCell>
                                                <TableCell>QUALIFIED APPLICANT/S</TableCell>
                                                <TableCell>NOT QUALIFIED APPLICANT/S</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell component="th" scope="row">{posInfo?.dept_title}</TableCell>
                                                <TableCell component="th" scope="row">{posInfo?.plantilla_no}</TableCell>
                                                <TableCell align="left">{posInfo?.sg}</TableCell>
                                                <TableCell align="left"></TableCell>
                                                <TableCell align="left">
                                                    {applicants[item] && applicants[item].map((x, index) => (
                                                        <>
                                                            {x.type === "qualified" &&
                                                                <Typography variant='body2' sx={{ borderBottom: '1px solid gray' }}>{x?.fname} {x?.mname} {x?.lname}</Typography>
                                                            }
                                                        </>
                                                    ))}
                                                </TableCell>
                                                <TableCell align="left">
                                                    {applicants[item] && applicants[item].map((x, index) => (
                                                        <>
                                                            {x.type === "not_qualified" &&
                                                                <Typography variant='body2' sx={{ borderBottom: '1px solid gray' }}>{x?.fname} {x?.mname} {x?.lname}</Typography>
                                                            }
                                                        </>
                                                    ))}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Box>
                    </div>
                ))
            }
            <div className='force-break'>
                <Box width='100%' >
                    <FormsHeader1 />
                </Box>
                <Box sx={{ mt: '50px', px: '40px' }}>
                    <Box mt={15} display="flex" justifyContent='space-between'>
                        <Box>
                            <Typography variant="body1" color="initial">Prepared by:</Typography>
                            <Typography variant="body1" color="initial" mt={3}><b>{signatoriesData?.preparedBy?.toUpperCase()}</b></Typography>
                            <Typography variant="body1" color="initial">{signatoriesData?.preparedByParenthetic}</Typography>
                            <Typography variant="body1" color="initial">{signatoriesData?.preparedByPosition}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body1" color="initial">Prepared by:</Typography>
                            <Typography variant="body1" color="initial" mt={3}><b>{signatoriesData?.reviewedBy?.toUpperCase()}</b></Typography>
                            <Typography variant="body1" color="initial">{signatoriesData?.reviewedByParenthetic}</Typography>
                            <Typography variant="body1" color="initial">{signatoriesData?.reviewedByPosition}</Typography>
                        </Box>
                    </Box>
                    <Box mt={5} display="flex" justifyContent='space-between'>
                        <Box>
                            <Typography variant="body1" color="initial">Approved by:</Typography>
                            <Typography variant="body1" color="initial" mt={3}><b>{signatoriesData?.approvedBy?.toUpperCase()}</b></Typography>
                            <Typography variant="body1" color="initial">{signatoriesData?.approvedByParenthetic}</Typography>
                            <Typography variant="body1" color="initial">{signatoriesData?.approvedByPosition}</Typography>
                        </Box>
                    </Box>
                </Box>
            </div>
        </>
    );
};

export default React.memo(PrintExamShortList);