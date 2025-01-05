import React, { useState, useEffect, useRef } from 'react'
import { orange, blue } from '@mui/material/colors'
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Container from '@mui/material/Container';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Pagination from '@mui/material/Pagination';
import Tooltip from '@mui/material/Tooltip'
import { useMediaQuery, IconButton, Typography } from '@mui/material';

import moment from 'moment'

// mui icons
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';

import { getProfiling, handleSearch } from './Controller';
import CustomDialog from './CustomDialog';
import Update from './Update';

const Profiling = () => {
    const [profiling, setProfiling] = useState([])
    const [loader, setLoader] = useState(true)

    const [searchName, setSearchName] = useState('')
    const [searchType, setSearchType] = useState('none')

    const [openDialog, setOpenDialog] = useState(false)
    const [dialogState, setDialogState] = useState('')
    const handleOpen = (item) => {
        setDialogState(item)
        setOpenDialog(true)
    }
    const handleClose = () => setOpenDialog(false)
    // for pagination
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const perPage = 5


    const handlePaginate = (e, v) => {
        let controller = new AbortController()
        console.log(v)
        setLoader(true)
        if (searchName) {
            handleSearch(searchName, searchType, setProfiling, setLoader, setTotal, setPage, v, perPage)
        }
        else {
            getProfiling(setProfiling, setLoader, setTotal, setPage, v, perPage, controller)
        }
    }

    useEffect(() => {
        let controller = new AbortController()

        getProfiling(setProfiling, setLoader, setTotal, setPage, page, perPage, controller)
    }, [])

    return (
        <Container >
            <CustomDialog open={openDialog} handleClose={handleClose} >
                <Update data={dialogState} setProfiling={setProfiling} profiling={profiling} handleClose={handleClose} />
            </CustomDialog>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1, gap: 1 }}>
                <TextField
                    id=""
                    label="search name"
                    size='small'
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
                <FormControl>
                    <InputLabel id="demo-review_notif-select-label">Applicant type</InputLabel>
                    <Select
                        labelId="demo-review_notif-select-label"
                        id="demo-review_notif-select"
                        label="Applicant type"
                        name="exam_notif"
                        size='small'
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <MenuItem value='none'>NONE</MenuItem>
                        <MenuItem value='employee'>EMPLOYEE</MenuItem>
                        <MenuItem value='applicant'>APPLICANT</MenuItem>
                    </Select>
                </FormControl>

                <Box display='flex' alignItems='center'>
                    <Tooltip title="search">
                        <SearchIcon color='primary' sx={{ cursor: 'pointer', fontSize: 35 }} onClick={() => handleSearch(searchName, searchType, setProfiling, setLoader, setTotal, setPage, page, perPage)} />
                    </Tooltip>
                </Box>

            </Box>
            <TableContainer component={Paper}>
                <Table aria-label="profiling table" size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>Position title</TableCell>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="center">Applicant name</TableCell>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>
                                Employee id</TableCell>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>Applicant id</TableCell>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="center">Review Notif</TableCell>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="center">Review Result</TableCell>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="center">Review Remarks</TableCell>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="center">Exam Notif</TableCell>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="center">Exam Result</TableCell>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="center">Exam Date</TableCell>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="center">Exam Time</TableCell>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="center">Exam Venue</TableCell>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="center">Exam Remarks</TableCell>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="center">Interview Notif</TableCell>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="center">Interview Venue</TableCell>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="center">Interview Result</TableCell>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="center">Interview Ranking</TableCell>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="center">Interview Remarks</TableCell>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="center">Vacancy Id</TableCell>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="center">Appointed</TableCell>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="center">Over all result</TableCell>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loader ? (
                            <>
                                {Array.from(Array(5)).map((item, index) => (
                                    <TableRow key={index}>
                                        {Array.from(Array(22)).map((item2, index2) => (
                                            <TableCell component="th" scope="row" key={index2}>
                                                <Skeleton variant="text" width="" height={45} animation='wave' sx={{ borderRadius: 0 }} />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </>
                        )
                            : (
                                <>
                                    {profiling && profiling.map((item, index) => (
                                        <TableRow key={item.id} sx={{ bgcolor: item?.employee_id ? blue[100] : '' }}>
                                            <TableCell align="center">{item?.position_info?.position_title}</TableCell>
                                            <TableCell align="center">{item?.name.fname?.toUpperCase()} {item?.name.mname?.toUpperCase()} {item?.name.lname?.toUpperCase()}</TableCell>
                                            <TableCell align="center">{item?.employee_id}</TableCell>
                                            <TableCell align="center">{item.applicant_id}</TableCell>
                                            <TableCell align="center">{item.review_notif === 1 ? 'Yes' : 'No'}</TableCell>
                                            <TableCell align="center">{item.review_result}</TableCell>
                                            <TableCell align="center">{item.review_remarks}</TableCell>
                                            <TableCell align="center">{item.exam_notif === 1 ? 'Yes' : 'No'}</TableCell>
                                            <TableCell align="center">{item.exam_result}</TableCell>
                                            <TableCell align="center">{moment(item.exam_date).format('MM/DD/YYYY')}</TableCell>
                                            <TableCell align="center">{item.exam_time}</TableCell>
                                            <TableCell align="center">{item.exam_venue}</TableCell>
                                            <TableCell align="center">{item.exam_remarks}</TableCell>
                                            <TableCell align="center">{item.interview_notif === 1 ? 'Yes' : 'No'}</TableCell>
                                            <TableCell align="center">{item.interview_venue}</TableCell>
                                            <TableCell align="center">{item.interview_results}</TableCell>
                                            <TableCell align="center">{item.interview_ranking}</TableCell>
                                            <TableCell align="center">{item.interview_remarks}</TableCell>
                                            <TableCell>
                                                <Box display="flex" alignItems='center'>
                                                    <Tooltip
                                                        componentsProps={{
                                                            tooltip: {
                                                                sx: {
                                                                    bgcolor: blue[500],
                                                                    '& .MuiTooltip-arrow': {
                                                                        color: blue[500],
                                                                    },
                                                                }
                                                            },
                                                        }}
                                                        arrow
                                                        title={
                                                            <Box width='100%' sx={{ p: 1 }}>
                                                                <Typography variant="body1" color="#fff" align='center' sx={{ mb: 2 }} >Job/Position information</Typography>
                                                                <Typography variant="body1" color="red" align='center' sx={{ bgcolor: '#fff', p: 1, display: 'flex', borderRadius: .5, mb: 1 }}>STATUS: {item?.position_info?.vacancy_status}</Typography>
                                                                <Typography variant="body1" color="#fff">Position DB ID: {item?.position_info?.job_vacancies_id}</Typography>
                                                                <Typography variant="body1" color="#fff">Position title: {item?.position_info?.position_title}</Typography>
                                                                <Typography variant="body1" color="#fff">Position Plantilla number: {item?.position_info?.plantilla_no}</Typography>
                                                                <Typography variant="body1" color="#fff">Position Monthly salary: {item?.position_info?.monthly_salary}</Typography>
                                                                <Typography variant="body1" color="#fff">Position Posting date: {item?.position_info?.posting_date}</Typography>
                                                                <Typography variant="body1" color="#fff">Position Closing date: {item?.position_info?.closing_date}</Typography>
                                                            </Box>
                                                        }>
                                                        <Box display='flex'>
                                                            <Button variant='contained' size='small' color='warning' startIcon={<InfoIcon />}>details</Button>
                                                        </Box>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{item.is_appoint === 1 ? 'Yes' : 'No'}</TableCell>
                                            <TableCell>{item.over_all_rating}</TableCell>
                                            <TableCell>
                                                <Tooltip title="Update row">
                                                    <IconButton aria-label="" size='small' sx={{ color: item?.employee_id ? '#fff' : orange[500], border: `2px solid ${item?.employee_id ? '#fff' : orange[500]}`, bgcolor: item?.employee_id ? blue[200] : '#fff' }} onClick={() => handleOpen(item)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </>
                            )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ mt: 1 }}>
                <Pagination count={Math.ceil(total / perPage)} page={page} color='primary' onChange={handlePaginate} />
            </Box>
        </Container>
    );
};

export default Profiling;