import React, { useEffect, useState, useContext, useRef, useLayoutEffect } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField'
import Fade from '@mui/material/Fade'
import Skeleton from '@mui/material/Skeleton'
import DeleteIcon from '@mui/icons-material/Delete';

import ArrowForward from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';

import CustomDialog from '../../../qs/basic_pds/CustomDialog';
import Container from '@mui/material/Container'

import { getSkillsHobbies, handleSubmit, handleDelete } from './Controller'

import CustomBackdrop from '../../../qs/CustomBackdrop';
import { PdsContext } from '../../MyContext';

import PdsBtn from '../../../PdsBtn';

const SkillsHobbies = () => {
    const tableRef = useRef(null)
    const [tableHeight, setTableHeight] = useState(0)
    const [hobbyList, setHobbyList] = useState([])
    const [recognition, setRecognition] = useState([])
    const [organization, setOrganization] = useState([])
    const { contextId, handleContextId, applicantStatusContext } = useContext(PdsContext)
    const [hobby, setHobby] = useState('')
    const [category, setCategory] = useState('')
    const [loader, setLoader] = useState(true)
    // dialog states
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    // 
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(1);
    const handleChange = (event, value) => {
        let controller = new AbortController()
        if (value === page)
            return
        else {
            setLoader(true)
            getSkillsHobbies(setHobbyList, value, setTotal, setLoader, contextId, controller)
            setPage(value);
        }

    };

    // backdrop states
    const [openBackdrop, setOpenBackdrop] = useState(false)
    const handleOpenBackdrop = () => setOpenBackdrop(true)
    const handleCloseBackdrop = () => setOpenBackdrop(false)

    useEffect(() => {
        let controller = new AbortController()
        getSkillsHobbies(setHobbyList, setRecognition, setOrganization, setLoader, contextId, controller)

        return () => controller.abort()
    }, [])

    useLayoutEffect(() => {
        setTableHeight(tableRef.current.clientHeight)
    }, [])
    return (
        <Box>
            <CustomDialog open={open} handleClose={handleClose}>
                <Container>
                    <form onSubmit={(e) => handleSubmit(e, hobby, recognition, organization, category, setCategory, setHobby, contextId, setHobbyList, setRecognition, setOrganization, handleClose, handleOpenBackdrop, handleCloseBackdrop)}>
                        <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                            <InputLabel id="demo-simple-select-label">Category</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={category}
                                label="Category"
                                onChange={(e) => setCategory(e.target.value)}
                                required

                            >
                                <MenuItem value={1}>SPECIAL SKILLS</MenuItem>
                                <MenuItem value={2}>NON-ACADEMIC DISTINCTIONS/RECOGNITION</MenuItem>
                                <MenuItem value={3}>MEMBER IN ASSOCIATION/ORGANIZATION</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            id=""
                            label="Skills/Hobby"
                            fullWidth
                            value={hobby}
                            sx={{ mb: 2 }}
                            required
                            onChange={e => setHobby(e.target.value)}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <CustomBackdrop open={openBackdrop} handleOpen={handleOpenBackdrop} handleClose={handleCloseBackdrop} />
                            <Button variant="contained" color="primary" endIcon={<ArrowForward />} type='submit' sx={{ borderRadius: '2rem' }} >
                                submit
                            </Button>
                        </Box>
                    </form>
                </Container>
            </CustomDialog>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" disabled={!contextId && !localStorage.getItem('applicant_temp_id') && applicantStatusContext === 3 ? true : false} color="primary" sx={{ borderRadius: '2rem', mb: 1 }} startIcon={<AddIcon />} onClick={handleOpen}>
                            Add
                        </Button>
                    </Box>
            <Box display='flex'  gap={1}  flexDirection={{xs:'column',md:'row'}} alignItems={{xs:'flex-start',md:'flex-start'}} >
                <Box flex={1} width='100%'>
                    <TableContainer component={Paper}>
                        <Table aria-label="skills hobbies table" stickyHeader>
                            <TableHead >
                                <TableRow sx={{ height: tableHeight }}>
                                    <TableCell className='cgb-color-table' align='center' colSpan={2} sx={{ color: '#fff' }}>SPECIAL SKILLS / HOBBIES</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loader ? (
                                    <>
                                        {Array.from(Array(5)).map((item, i) => (
                                            <TableRow key={i}>
                                                <TableCell align='center' component="th" scope="row"><Skeleton variant="text" fullWidth width="" height="" animation="pulse" /></TableCell>
                                                <TableCell align='center' component="th" scope="row"><Skeleton variant="text" fullWidth width="" height="" animation="pulse" /></TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {hobbyList && hobbyList.map((item, i) => (
                                            <Fade in key={item.id}>
                                                <TableRow>
                                                    <TableCell align='left' component="th" scope="row">
                                                        <PdsBtn type='delete' onClick={() => handleDelete(item.id, 1, hobbyList, setHobbyList, setRecognition, setOrganization)} />
                                                    </TableCell>
                                                    <TableCell align='left' component="th" scope="row">{item.description}</TableCell>
                                                </TableRow>
                                            </Fade>
                                        ))}
                                    </>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {!loader &&
                        <Box sx={{ display: 'flex', mt: .5 }}>
                            {hobbyList.length === 0 && <Typography sx={{ p: .5, bgcolor: 'error.main', color: '#fff', borderRadius: '.2rem' }}>No record found!</Typography>}
                        </Box>
                    }
                </Box>
                <Box flex={1} width='100%'>
                    <TableContainer component={Paper}>
                        <Table aria-label="skills hobbies table" stickyHeader>
                            <TableHead >
                                <TableRow ref={tableRef}>
                                    <TableCell className='cgb-color-table' align='center' colSpan={2} sx={{ color: '#fff' }}>NON-ACADEMIC DISTINCTIONS/RECOGNITION</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loader ? (
                                    <>
                                        {Array.from(Array(5)).map((item, i) => (
                                            <TableRow key={i}>
                                                <TableCell align='center' component="th" scope="row"><Skeleton variant="text" fullWidth width="" height="" animation="pulse" /></TableCell>
                                                <TableCell align='center' component="th" scope="row"><Skeleton variant="text" fullWidth width="" height="" animation="pulse" /></TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {recognition && recognition.map((item, i) => (
                                            <Fade in key={item.id}>
                                                <TableRow>
                                                    <TableCell align='left' component="th" scope="row" sx={{ display: 'flex' }}>
                                                        <PdsBtn type='delete' onClick={() => handleDelete(item.id, 2, recognition, setHobbyList, setRecognition, setOrganization)} />
                                                    </TableCell>
                                                    <TableCell align='left' component="th" scope="row">{item.description}</TableCell>
                                                </TableRow>
                                            </Fade>
                                        ))}
                                    </>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {!loader &&
                        <Box sx={{ display: 'flex', mt: .5 }}>
                            {recognition.length === 0 && <Typography sx={{ p: .5, bgcolor: 'error.main', color: '#fff', borderRadius: '.2rem' }}>No record found!</Typography>}
                        </Box>
                    }
                </Box>
                <Box flex={1} width='100%'>
                    <TableContainer component={Paper}>
                        <Table aria-label="skills hobbies table" stickyHeader>
                            <TableHead sx={{ height: tableHeight }}>
                                <TableRow>
                                    <TableCell className='cgb-color-table' align='center' colSpan={2} sx={{ color: '#fff' }}>MEMBER IN ASSOCIATION/ORGANIZATION</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loader ? (
                                    <>
                                        {Array.from(Array(5)).map((item, i) => (
                                            <TableRow key={i}>
                                                <TableCell align='center' component="th" scope="row"><Skeleton variant="text" fullWidth width="" height="" animation="pulse" /></TableCell>
                                                <TableCell align='center' component="th" scope="row"><Skeleton variant="text" fullWidth width="" height="" animation="pulse" /></TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {organization && organization.map((item, i) => (
                                            <Fade in key={item.id}>
                                                <TableRow>
                                                    <TableCell align='left' component="th" scope="row" sx={{ display: 'flex' }}>
                                                        <PdsBtn type='delete' onClick={() => handleDelete(item.id, 3, organization, setHobbyList, setRecognition, setOrganization)} />
                                                    </TableCell>
                                                    <TableCell align='left' component="th" scope="row">{item.description}</TableCell>
                                                </TableRow>
                                            </Fade>
                                        ))}
                                    </>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {!loader &&
                        <Box sx={{ display: 'flex', mt: .5 }}>
                            {organization.length === 0 && <Typography sx={{ p: .5, bgcolor: 'error.main', color: '#fff', borderRadius: '.2rem' }}>No record found!</Typography>}
                        </Box>
                    }
                </Box>
            </Box>

        </Box >
    );
};

export default SkillsHobbies;