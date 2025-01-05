import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Pagination from '@mui/material/Pagination'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Collapse from '@mui/material/Collapse';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import { blue } from '@mui/material/colors';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import RateReviewIcon from '@mui/icons-material/RateReview';

import axios from 'axios';
import moment from 'moment';

import CustomDialog from './CustomDialog';
import RateInterviewee from './RateInterviewee';
import Warnings from '../recruitment/jobPostingManagement/componentsByStatus/receivingApplicants/Warnings';
import { Button } from '@mui/material';

const Panel = () => {

    let controller = new AbortController()
    const [interviewee, setInterviewee] = useState([])
    const [openRatingDialog, setOpenRatingDialog] = useState(false)
    const [ratingDialogData, setRatingDialogData] = useState('')
    const [ratingDialogRow, setRatingDialogRow] = useState('')
    const handleOpenRatingDialog = (item, row) => {
        setRatingDialogData(item)
        setRatingDialogRow(row)
        setOpenRatingDialog(true)
    }
    const handleCloseRatingDialog = () => setOpenRatingDialog(false)

    // pagination
    const perPage = 5
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)

    // table loader
    const [tableLoader, setTableLoader] = useState(true)

    const getInterviewee = async (page) => {
        let res = await axios.get(`/api/recruitment/interview/employee/getInterviweee?page=${page}&&perPage=${perPage}`, {}, { signal: controller.signal })
        console.log(res)
        setTableLoader(false)
        setInterviewee(res.data.data)
        setPage(res.data.current_page)
        setTotal(res.data.total)
    }

    const handlePaginate = (e, v) => {
        if (v === page) {
            return
        }
        setTableLoader(true)
        setPage(v)
        getInterviewee(v)
    }
    useEffect(() => {
        getInterviewee(page)
    }, [])
    return (
        <Container>
            <CustomDialog open={openRatingDialog} handleClose={handleCloseRatingDialog} specifyWidth="90%" >
                <RateInterviewee data={ratingDialogData} ratingDialogRow={ratingDialogRow} />
            </CustomDialog>
            <Box sx={{ mt: 2 }}>
                <TableContainer component={Paper} sx={{ mt: 1 }}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left" className='cgb-color-table' sx={{ color: '#fff' }} width="10%"></TableCell>
                                <TableCell align="left" className='cgb-color-table' sx={{ color: '#fff' }}>Position title</TableCell>
                                <TableCell align="left" className='cgb-color-table' sx={{ color: '#fff' }}>Publication posting date</TableCell>
                                <TableCell align="left" className='cgb-color-table' sx={{ color: '#fff' }}>Publication closing date</TableCell>
                                <TableCell align="left" className='cgb-color-table' sx={{ color: '#fff' }}>Posted by</TableCell>
                                <TableCell align="right" className='cgb-color-table' sx={{ color: '#fff' }}>Total Interviewee</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableLoader ? (
                                <>
                                    {Array.from(Array(5)).map((item, index) =>
                                        <TableRow key={index} >
                                            {Array.from(Array(6)).map((item2, index2) =>
                                                <TableCell key={index2}><Skeleton /></TableCell>
                                            )}
                                        </TableRow>
                                    )}

                                </>
                            ) : (
                                <>
                                    {interviewee && interviewee.map((row, index) => (
                                        <Row row={row} key={index} handleOpenRatingDialog={handleOpenRatingDialog}></Row>
                                    ))}
                                </>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ mt: 1 }}>
                    <Pagination page={page} count={Math.ceil(total / perPage)} color="primary" variant='outlined' onChange={handlePaginate} />
                </Box>
            </Box>

        </Container>
    );
};

function Row(props) {
    const { row } = props;
    const { handleOpenRatingDialog } = props;
    const [open, setOpen] = React.useState(false);
    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" align='left'>
                    {row?.position_title}
                </TableCell>
                <TableCell component="th" scope="row" align='left'>
                    {row?.posting_date}
                </TableCell>
                <TableCell component="th" scope="row" align='left'>
                    {row?.closing_date}
                </TableCell>
                <TableCell component="th" scope="row" align='left'>
                    {row?.posted_by}
                </TableCell>
                <TableCell align="right">{row?.interviewee.length} applicant(s)</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="body1" sx={{ color: 'success.main' }} align="center" gutterBottom>CO-PANELIST</Typography>
                            <Grid container spacing={1}>
                                {row?.co_panelist.map((item, i) => (
                                    <Grid item xs={12} sm={12} md={4} lg={4} key={i}>
                                        <Card sx={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }} >
                                            <Typography align='center' variant="body1" color="#5C5C5C">{item.is_chairman ? 'Chairman' : 'Member'}</Typography>
                                            <Typography sx={{ fontSize: 10 }} color={blue[500]} align='center'>( {item?.dept_title} )</Typography>
                                            <CardHeader
                                                sx={{ flex: 1 }}
                                                title={<Typography variant='body2' align='center'>
                                                    {item?.fname + ' ' + item?.mname + ' ' + item.lname + ' '}
                                                </Typography>}
                                            />
                                        </Card>

                                    </Grid>
                                ))}
                            </Grid>
                            <Typography variant="body1" gutterBottom component="div" color="primary" mt={2}>
                                Interviewee information
                            </Typography>
                            <Warnings arr={[{ color: 'primary.light', text: 'Insider applicant' }]} />
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ bgcolor: 'primary.main', color: '#fff' }}>Full name</TableCell>
                                        <TableCell sx={{ bgcolor: 'primary.main', color: '#fff' }}>Interview venue</TableCell>
                                        <TableCell sx={{ bgcolor: 'primary.main', color: '#fff' }}>Interview time</TableCell>
                                        <TableCell sx={{ bgcolor: 'primary.main', color: '#fff' }}>Interview date</TableCell>
                                        <TableCell sx={{ bgcolor: 'primary.main', color: '#fff' }} align='right'>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row?.interviewee.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell component="th" scope="row" sx={{ bgcolor: item?.employee_id ? 'primary.light' : '', color: item?.employee_id ? '#fff' : '' }}>
                                                {item.fname} {item.mname} {item.lname}
                                            </TableCell>
                                            <TableCell component="th" scope="row" sx={{ bgcolor: item?.employee_id ? 'primary.light' : '', color: item?.employee_id ? '#fff' : '' }}>
                                                {item.interview_venue}
                                            </TableCell>
                                            <TableCell component="th" scope="row" sx={{ bgcolor: item?.employee_id ? 'primary.light' : '', color: item?.employee_id ? '#fff' : '' }}>
                                                {moment(item.interview_time, "HH:mm:ss").format("hh:mm A")}
                                            </TableCell>
                                            <TableCell component="th" scope="row" sx={{ bgcolor: item?.employee_id ? 'primary.light' : '', color: item?.employee_id ? '#fff' : '' }}>
                                                {item.interview_date}
                                            </TableCell>
                                            <TableCell component="th" scope="row" align='right'>
                                                <Tooltip title="SET RATING" placement='left'>
                                                    <IconButton aria-label="set rating" size='small' sx={{ bgcolor: 'warning.main', '&:hover': { bgcolor: 'warning.dark', transform: 'scale(1.1)', transition: 'transform .2s' }, overflow: 'hidden' }}
                                                        onClick={() => handleOpenRatingDialog(item, row)}
                                                    >
                                                        <RateReviewIcon sx={{ color: '#fff', fontSize: 20 }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default Panel;