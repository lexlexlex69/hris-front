import React, { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import moment from 'moment';
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { TableFooter } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { read, utils, writeFile, writeFileXLSX } from 'xlsx';

import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';


const ComparativeAssessment = ({ comparativeData, defaultList, attestedDefault, prepared, certified, approved, dataVacancy }) => {
    const theme = createTheme({
        typography: {
            fontSize: 1
        }
    })
    const tablePrintRef = useRef(null)
    const [dateInterview, setDateInterview] = useState({
        from: '',
        to: ''
    });
    const handlePrint = useReactToPrint({
        content: () => tablePrintRef.current,
    });
    const [data, setData] = useState([])
    const tableRef = useRef()
    const [attested, seAttested] = useState([])
    const [vacancyInfo, setVacancyInfo] = useState('')

    const getVacancyInfo = async (controller) => {
        try {
            let res = await axios.get(`/api/recruitment/jobPosting/status/set-interview/getVacancyInfo?vacancyId=${dataVacancy}`, {}, { signal: controller.abort() })
            setVacancyInfo(res.data)
        }
        catch (err) {
            toast.error(err.message)
        }
    }

    const handlePrintTable = () => {
        Swal.fire({
            text: 'Processing data',
            icon: 'info'
        })
        Swal.showLoading()
        setTimeout(() => {
            Swal.close()
            handlePrint()
        }, 500)

    }

    const handleGenerate = () => {
        // let comparative = data.map((item, i) => {
        //     return { no: i + 1, name: item.name, Education: item.eval_education, Experience: item.eval_experience, Trainings: item.eval_training, Score: item.exam_score, '20%': item.exam_rate, Rating: item.ave, '50%': item.bbi_rate, 'Total Score': item.total_score, Ranking: i + 1 }
        // })
        // let newComparative = utils.json_to_sheet(comparative, { origin: 'A3', skipHeader: true }); for json to sheet
        let table = document.querySelector("#tableRef")
        let newComparative = utils.table_to_sheet(table);
        let wb = utils.book_new();
        // utils.sheet_add_aoa(newComparative, Heading, { origin: 'A1' }); for adding header
        utils.book_append_sheet(wb, newComparative, "Comparative");
        writeFileXLSX(wb, `Comparative_${moment(new Date()).format('MMM-DD-YY h:m:s a')}.xlsx`);
    }

    useEffect(() => {
        seAttested(attestedDefault.filter((x) => !x.name && !x.office && !x.designation && !x.head ? null : x))
    }, [attestedDefault])


    useEffect(() => {
        let controller = new AbortController()
        getVacancyInfo(controller)

        return (() => controller.abort())
    }, [])

    useEffect(() => {
        let newData = comparativeData?.comparative_data?.map((item, index) => {
            let total = 0
            let name = defaultList.filter((x) => x?.profile_id === item.profile_id)
            name[0].coaching_result = item?.coaching_result
            name[0].delivering_service = item?.delivering_service
            name[0].exemplifying_integrity = item?.exemplifying_integrity
            name[0].high_performance_organization = item?.high_performance_organization
            name[0].leading_change = item?.leading_change
            name[0].solving_problems = item?.solving_problems
            name[0].strategic_creativity = item?.strategic_creativity
            name[0].working_relationship = item?.working_relationship

            total += Number(name[0].coaching_result / name[0].interviewers.length)
            total += Number(name[0].delivering_service / name[0].interviewers.length)
            total += Number(name[0].exemplifying_integrity / name[0].interviewers.length)
            total += Number(name[0].high_performance_organization / name[0].interviewers.length)
            total += Number(name[0].leading_change / name[0].interviewers.length)
            total += Number(name[0].solving_problems / name[0].interviewers.length)
            total += Number(name[0].strategic_creativity / name[0].interviewers.length)
            total += Number(name[0].working_relationship / name[0].interviewers.length)
            let ave = total / 8
            let exam_rate = item?.exam_score * .20
            let bbi_rate = (((ave) / 5) * .5) * 100
            let total_score = item.eval_education + item.eval_experience + item.eval_training + exam_rate + bbi_rate
            return { ...item, total: total, ave: ave, name: name[0]?.fname + ' ' + name[0]?.mname + ' ' + name[0]?.lname, exam_rate: exam_rate, bbi_rate: bbi_rate, total_score: total_score }
        })
        let sortedList = newData.sort(function (a, b) {
            return a.total_score > b.total_score
        })
        setData(sortedList)
    }, [comparativeData])
    return (
        <Box sx={{ overflowY: 'scroll', height: '100%' }}>
            <Box display="flex" gap={2} mb={1}>
                <Button variant='contained' startIcon={<AssessmentIcon />} color='success' onClick={handleGenerate}>Generate</Button>
                <Button variant='contained' startIcon={<PrintIcon />} onClick={handlePrintTable}>Print</Button>
            </Box>
            <Box display='flex' gap={1}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Interview Date From"
                        value={dateInterview.from}
                        onChange={(newValue) => {
                            setDateInterview(prev => ({ ...prev, from: newValue }));
                        }}
                        renderInput={(params) => <TextField size='small' {...params} />}
                    />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Interview Date To"
                        value={dateInterview.to}
                        onChange={(newValue) => {
                            console.log(newValue)
                            setDateInterview(prev => ({ ...prev, to: newValue }));
                        }}
                        renderInput={(params) => <TextField size='small' {...params} />}
                    />
                </LocalizationProvider>
                <Button variant='contained' size='small' onClick={() => setDateInterview({ from: '', to: '' })}>reset dates</Button>
            </Box>

            <Box >
                <div ref={tablePrintRef}>
                    <TableContainer sx={{ p: 2 }}>
                        <Table sx={{ minWidth: 650 }} className='comparative-print-table' aria-label="comparative assessment table" size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={13} sx={{ border: 'none' }}>
                                        <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }} color="initial" textAlign="center">COMPARATIVE ASSESSMENT</Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow></TableRow>
                                <TableRow>
                                    <TableCell colSpan={13} sx={{ p: 0, m: 0 }}>
                                        <Box sx={{ bgcolor: '#c5e0b3', width: '100%' }}>
                                            <Box display='flex' justifyContent="space-between">
                                                <Typography pl={2} className='font-12px' color="initial">Date of Interview: {dateInterview?.to ? 'from' : ''}  {dateInterview?.from ? moment(dateInterview?.from?.$d, 'YYYY-DD-MM').format('YYYY-MM-DD') : ''} {dateInterview?.to ? 'to' : ''} {dateInterview?.to ? moment(dateInterview?.to?.$d, 'YYYY-DD-MM').format('YYYY-DD-MM') : ''}</Typography>
                                                <Typography sx={{ bgcolor: '#548135' }} className='font-12px' color="#fff" width='40%' pl={2}>Last Date for Final Action: {moment(vacancyInfo?.expiry_date, 'YYYY-MM-DD').format('YYYY-MM-DD')}</Typography>
                                            </Box>
                                            <Typography pl={2} className='font-12px' color="initial">POSITION: {vacancyInfo?.position_name}</Typography>
                                            <Typography pl={2} className='font-12px' color="initial">ITEM NUMBER: {vacancyInfo?.plantilla_no}</Typography>
                                            <Typography pl={2} className='font-12px' color="initial">OFFICE: {vacancyInfo?.dept_title}</Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                                <TableRow sx={{ bgcolor: '#e2efd9' }}>
                                    <TableCell rowSpan={2} className='font-12px'>No.</TableCell>
                                    <TableCell rowSpan={2} align="left" className='font-12px'>Name</TableCell>
                                    <TableCell rowSpan={2} align="left" className='font-12px'>EDUCATION</TableCell>
                                    <TableCell rowSpan={2} align="left" className='font-12px'>EXPERIENCE</TableCell>
                                    <TableCell rowSpan={2} align="left" className='font-12px'>TRAININGS</TableCell>
                                    <TableCell colSpan={2} align="left" className='font-12px'>WRITTEN EXAMINATION</TableCell>
                                    <TableCell colSpan={2} align="left" className='font-12px'>BBI</TableCell>
                                    <TableCell rowSpan={2} align="left" className='font-12px'>TOTAL SCORE</TableCell>
                                    <TableCell rowSpan={2} align="left" className='font-12px'>RAKING</TableCell>
                                    <TableCell rowSpan={2} align="left" className='font-12px'>PHOTO</TableCell>
                                    <TableCell rowSpan={2} align="left" className='font-12px'>APPOINTING AUTHORITY'S SIGNATURE</TableCell>
                                </TableRow>
                                <TableRow sx={{ bgcolor: '#e2efd9' }}>
                                    <TableCell className='font-12px'>SCORE</TableCell>
                                    <TableCell className='font-12px'>20%</TableCell>
                                    <TableCell className='font-12px'>RATING</TableCell>
                                    <TableCell className='font-12px'>50%</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data && data.map((item, i) => (
                                    <TableRow
                                        key={item?.profile_id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" className='font-12px'>
                                            {i + 1}
                                        </TableCell>
                                        <TableCell className='font-12px' align="left">{item?.name}</TableCell>
                                        <TableCell className='font-12px' align="left">{item?.eval_education}</TableCell>
                                        <TableCell className='font-12px' align="left">{item?.eval_experience}</TableCell>
                                        <TableCell className='font-12px' align="left">{item?.eval_training}</TableCell>
                                        <TableCell className='font-12px' align="left">{item?.exam_score}</TableCell>
                                        <TableCell className='font-12px' align="left">{item?.exam_rate.toFixed(2)}</TableCell>
                                        <TableCell className='font-12px' align="left">{item?.ave?.toString().slice(0, 5)}</TableCell>
                                        <TableCell className='font-12px' align="left">{item?.bbi_rate.toFixed(2)}</TableCell>
                                        <TableCell className='font-12px' align="left">{item?.total_score.toFixed(2)}</TableCell>
                                        <TableCell className='font-12px' align="left">{i + 1}</TableCell>
                                        <TableCell className='font-12px' align="left"></TableCell>
                                        <TableCell className='font-12px' align="left"></TableCell>
                                    </TableRow>
                                ))}
                                <TableRow></TableRow>
                                <TableRow></TableRow>
                            </TableBody>
                            <TableFooter className='comparative-print-table-no-b '>
                                <TableRow>
                                    <TableCell colSpan={13}>
                                        <Box width="100%" display='flex' sx={{ justifyContent: 'space-between' }}>
                                            <Box width="20%">
                                                <Typography className='font-12px' fontWeight={700}>Prepared by:</Typography>
                                                <Typography align='center' fontWeight={700} className='font-12px' mt={5}>{prepared?.name?.toUpperCase()}</Typography>
                                                <Typography align='center' fontWeight={700} className='font-12px'>{prepared?.office}</Typography>
                                                <Typography align='center' fontWeight={700} className='font-12px'>{prepared?.designation}</Typography>
                                                <Typography align='center' fontWeight={700} className='font-12px'>{prepared?.head}</Typography>
                                            </Box>
                                            <Box width="20%">
                                                <Typography fontWeight={700}>Certified by:</Typography>
                                                <Typography fontWeight={700} align='center' className='font-12px' mt={5}>{certified?.name?.toUpperCase()}</Typography>
                                                <Typography fontWeight={700} align='center' className='font-12px'>{certified?.office}</Typography>
                                                <Typography fontWeight={700} align='center' className='font-12px'>{certified?.designation}</Typography>
                                                <Typography fontWeight={700} align='center' className='font-12px'>{certified?.head}</Typography>
                                            </Box>
                                        </Box>
                                        <Box width="100%">
                                            <Typography mt={10} fontWeight={700} className='font-12px' align='center'>Attested by:</Typography>
                                        </Box>
                                        <Box width="100%" display="flex" sx={{ flexWrap: 'wrap', justifyContent: 'center', mt: 10 }}>
                                            {attested?.map((item, index) => (
                                                <Box display='flex' flexDirection='column' key={index} flex={1} mb={10}>
                                                    <Typography fontWeight={700} align='center' className='font-12px'>{item?.name?.toUpperCase()}</Typography>
                                                    <Typography fontWeight={700} align='center' className='font-12px'>{item?.office}</Typography>
                                                    <Typography fontWeight={700} align='center' className='font-12px'>{item?.designation}</Typography>
                                                    <Typography fontWeight={700} align='center' className='font-12px'>{item?.head}</Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                        <Box>
                                            <Typography fontWeight={700} className='font-12px' color="initial">Approved by: </Typography>
                                            <Typography fontWeight={700} align='center' className='font-12px'>{approved?.name}</Typography>
                                            <Typography fontWeight={700} align='center' className='font-12px'>City Mayor</Typography>
                                            <Typography fontWeight={700} align='center' className='font-12px'>HRMPB Chairperon</Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </div>
            </Box>

            <TableContainer sx={{ display: 'none' }}>
                <Table sx={{ minWidth: 650 }} aria-label="comparative assessment table" size='small' ref={tableRef} id="tableRef">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell colSpan={5}>
                                <Typography className='font-12px' color="initial" textAlign="center">COMPARATIVE ASSESSMENT</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow></TableRow>
                        <TableRow>
                            <TableCell colSpan={8} className='font-12px'>Date of Interview: {dateInterview?.to ? 'from' : ''}  {dateInterview?.from ? moment(dateInterview?.from?.$d, 'YYYY-DD-MM').format('YYYY-MM-DD') : ''} {dateInterview?.to ? 'to' : ''} {dateInterview?.to ? moment(dateInterview?.to?.$d, 'YYYY-DD-MM').format('YYYY-DD-MM') : ''}</TableCell>
                            <TableCell colSpan={5} className='font-12px'>Last Date for Final Action: {moment(vacancyInfo?.expiry_date, 'YYYY-MM-DD').format('YYYY-MM-DD')}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={13} className='font-12px'>POSITION: {vacancyInfo?.position_name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={13} className='font-12px'>ITEM NUMBER: {vacancyInfo?.plantilla_no}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={13} className='font-12px'>OFFICE: {vacancyInfo?.dept_title}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={13} className='font-12px'></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell rowSpan={2} className='font-12px'>No.</TableCell>
                            <TableCell rowSpan={2} className='font-12px' align="left">Name</TableCell>
                            <TableCell rowSpan={2} className='font-12px' align="left">EDUCATION</TableCell>
                            <TableCell rowSpan={2} className='font-12px' align="left">EXPERIENCE</TableCell>
                            <TableCell rowSpan={2} className='font-12px' align="left">TRAININGS</TableCell>
                            <TableCell colSpan={2} className='font-12px' align="left">WRITTEN EXAMINATION</TableCell>
                            <TableCell colSpan={2} className='font-12px' align="left">BBI</TableCell>
                            <TableCell rowSpan={2} className='font-12px' align="left">TOTAL SCORE</TableCell>
                            <TableCell rowSpan={2} className='font-12px' align="left">RAKING</TableCell>
                            <TableCell rowSpan={2} className='font-12px' align="left">PHOTO</TableCell>
                            <TableCell rowSpan={2} className='font-12px' align="left">APPOINTING AUTHORITY'S SIGNATURE</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className='font-12px'>SCORE</TableCell>
                            <TableCell className='font-12px'>20%</TableCell>
                            <TableCell className='font-12px'>RATING</TableCell>
                            <TableCell className='font-12px'>50%</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data && data.sort((a, b) => a.total_score < b.total_score ? 1 : -1)?.map((item, i) => (
                            <TableRow
                                key={item.profile_id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row" className='font-12px'>
                                    {i + 1}
                                </TableCell>
                                <TableCell className='font-12px' align="left">{item?.name}</TableCell>
                                <TableCell className='font-12px' align="left">{item?.eval_education}</TableCell>
                                <TableCell className='font-12px' align="left">{item?.eval_experience}</TableCell>
                                <TableCell className='font-12px' align="left">{item?.eval_training}</TableCell>
                                <TableCell className='font-12px' align="left">{item?.exam_score}</TableCell>
                                <TableCell className='font-12px' align="left">{item?.exam_rate.toFixed(2)}</TableCell>
                                <TableCell className='font-12px' align="left">{item?.ave.toFixed(2)}</TableCell>
                                <TableCell className='font-12px' align="left">{item?.bbi_rate.toFixed(2)}</TableCell>
                                <TableCell className='font-12px' align="left">{item?.total_score.toFixed(2)}</TableCell>
                                <TableCell className='font-12px' align="left">{i + 1}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow></TableRow>
                        <TableRow></TableRow>
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell className='font-12px' colSpan={2}>Prepared by:</TableCell>
                            {Array.from(Array(9)).map((item, i) => <TableCell ></TableCell>)}
                            <TableCell className='font-12px' colSpan={2}>Certified Correct:</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={13}></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={13}></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={13}></TableCell>
                        </TableRow>
                        {Array.from(Array(4)).map((item, index) => (
                            <TableRow>
                                <TableCell className='font-12px' colSpan={2}>{index === 0 && prepared?.name?.toUpperCase()} {index === 1 && prepared?.office} {index === 2 && prepared?.office} {index === 3 && prepared?.head}</TableCell>
                                {Array.from(Array(9)).map((item, i) => <TableCell ></TableCell>)}
                                <TableCell className='font-12px' colSpan={2}>{index === 0 && certified?.name?.toUpperCase()} {index === 1 && certified?.office} {index === 2 && certified?.office} {index === 3 && certified?.head}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={13}></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={13}></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={13}></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={5}></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell ></TableCell>
                            <TableCell ></TableCell>
                            <TableCell ></TableCell>
                            <TableCell ></TableCell>
                            <TableCell ></TableCell>
                            <TableCell className='font-12px' colSpan={8}>Attested by:</TableCell>
                        </TableRow>
                        <TableRow><TableCell colSpan={13}></TableCell></TableRow>
                        <TableRow><TableCell colSpan={13}></TableCell></TableRow>
                        <TableRow><TableCell colSpan={13}></TableCell></TableRow>
                        <TableRow><TableCell colSpan={13}></TableCell></TableRow>
                        {Array.from(Array(5)).map((item, index) => (
                            <>
                                if(index === 2)
                                <TableRow>
                                    {Array.from(Array(5)).map((item, i) => (
                                        <>
                                            {i === 1 && <TableCell></TableCell>}
                                            {i === 3 && <TableCell></TableCell>}
                                            {index === 0 &&
                                                <TableCell className='font-12px' colSpan={2}>{attested[i]?.name?.toUpperCase()}</TableCell>
                                            }
                                            {index === 1 &&
                                                <TableCell className='font-12px' colSpan={2}>{attested[i]?.office}</TableCell>
                                            }
                                            {index === 2 &&
                                                <TableCell className='font-12px' colSpan={2}>{attested[i]?.designation}</TableCell>
                                            }
                                            {index === 3 &&
                                                <TableCell className='font-12px' colSpan={2}>{attested[i]?.head}</TableCell>
                                            }
                                        </>
                                    ))}
                                </TableRow>
                            </>
                        ))}
                        <TableRow>
                            <TableCell colSpan={13} ></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={13} ></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={13} ></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={5} ></TableCell>
                            <TableCell className='font-12px' colSpan={8} >Approved by:</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={13} ></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={13} ></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={13} ></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={5} ></TableCell>
                            <TableCell className='font-12px' colSpan={8} >{approved?.name?.toUpperCase()}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={5} ></TableCell>
                            <TableCell className='font-12px' colSpan={8} >City Mayor</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className='font-12px' colSpan={5} ></TableCell>
                            <TableCell className='font-12px' colSpan={8} >HRMPSB Chairperson</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default React.memo(ComparativeAssessment);