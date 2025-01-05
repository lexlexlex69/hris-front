import React, { useEffect, useState, useContext } from 'react';
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
import Pagination from '@mui/material/Pagination';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField'
import Fade from '@mui/material/Fade'

import AddIcon from '@mui/icons-material/Add'
import CustomDialog from '../../qs/basic_pds/CustomDialog';
import { ArrowForward } from '@mui/icons-material';
import { PdsContext } from '../MyContext';

import { getFamilyBackground, handleSubmit, handleSubmitChild , handleUpdateChild, handleDeleteChild} from './Controller'
import { Skeleton } from '@mui/material'

import CustomBackdrop from '../../qs/CustomBackdrop';

import PdsBtn from '../../PdsBtn'
import moment from 'moment';

const FamilyBackground = () => {
    const { contextId, handleContextId, applicantStatusContext } = useContext(PdsContext)

    const [childState, setChildState] = useState({
        child_name: '',
        dob: ''
    })

    const [childList, setChildList] = useState([])
    const [familyState, setFamilyState] = useState({
        spouse_surname: '',
        spouse_fname: '',
        spouse_mname: '',
        occupation: '',
        employeer_name: '',
        emp_address: '',
        tel_no: '',
        father_surname: '',
        father_fname: '',
        father_mname: '',
        mother_maiden: '',
        mother_lname: '',
        mother_fname: '',
        mother_mname: '',
        father_extn: '',
        spouse_extn: ''
    })

    const [loader, setLoader] = useState(true)
    const [loaderChild, setLoaderChild] = useState(true)

    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const [updateModal, setUpdateModal] = useState(false)
    const handleCloseUpdate = () => setUpdateModal(false)
    const [updateModalData, setUpdateModalData] = useState({
        child_name: '',
        dob: ''
    })
    function openUpdate(param) {
        setUpdateModalData(param)
        setUpdateModal(true)
    }

    // backdrop states
    const [openBackdrop, setOpenBackdrop] = useState(false)
    const handleOpenBackdrop = () => setOpenBackdrop(true)
    const handleCloseBackdrop = () => setOpenBackdrop(false)

    const handleChange = (e) => {
        setFamilyState(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleChangeChild = (e) => {
        setChildState(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    useEffect(() => {
        let controller = new AbortController()
        getFamilyBackground(setFamilyState, setChildList, parseInt(localStorage.getItem('applicant_temp_id')) ? parseInt(localStorage.getItem('applicant_temp_id')) : contextId ? contextId : '', controller, setLoader, setLoaderChild)
        return () => controller.abort()
    }, [])
    return (
        <Box sx={{ px: { xs: 1, md: 15, lg: 15 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <CustomDialog open={open} handleClose={handleClose}>
                <CustomBackdrop open={openBackdrop} handleOpen={handleOpenBackdrop} handleClose={handleCloseBackdrop} />
                <Box sx={{ p: 2, display: 'flex', gap: 2, flexDirection: 'column' }}>
                    <TextField
                        id=""
                        label="CHILD FULLNAME"
                        fullWidth
                        name='child_name'
                        value={childState.child_name}
                        onChange={handleChangeChild}
                    />
                    <TextField
                        id=""
                        label="DATE OF BIRTH"
                        focused
                        type='date'
                        fullWidth
                        name='dob'
                        value={childState.dob}
                        onChange={handleChangeChild}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" color="primary" sx={{ borderRadius: '2rem' }} endIcon={<ArrowForward />} onClick={() => handleSubmitChild(childState, setChildState, contextId, setChildList, handleClose, handleOpenBackdrop, handleCloseBackdrop)}>
                            Submit
                        </Button>
                    </Box>
                </Box>

            </CustomDialog>
            <CustomDialog open={updateModal} handleClose={handleCloseUpdate} forUpdate>
                <CustomBackdrop open={openBackdrop} handleOpen={handleOpenBackdrop} handleClose={handleCloseBackdrop} />
                <Box sx={{ p: 2, display: 'flex', gap: 2, flexDirection: 'column' }}>
                    <TextField
                        id=""
                        label="CHILD FULLNAME"
                        fullWidth
                        name='child_name'
                        value={updateModalData.child_name}
                        onChange={e => setUpdateModalData(prev => ({ ...prev, child_name: e.target.value }))}
                    />
                    <TextField
                        id=""
                        label="DATE OF BIRTH"
                        focused
                        type='date'
                        fullWidth
                        name='dob'
                        value={updateModalData.dob}
                        onChange={e => setUpdateModalData(prev => ({ ...prev, dob: e.target.value }))}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" color="warning" sx={{ borderRadius: '2rem' }} endIcon={<ArrowForward />} onClick={() => handleUpdateChild(childList, setChildList, contextId, updateModalData, handleCloseUpdate, handleOpenBackdrop, handleCloseBackdrop)}>
                            Update
                        </Button>
                    </Box>
                </Box>

            </CustomDialog>
            {loader ? (<>
                {Array.from(Array(5)).map((item, i) => (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, my: 1 }} key={i}>
                        <Skeleton variant="text" width="100%" height="" fullWidth animation="pulse" />
                        <Skeleton variant="text" width="100%" height="" fullWidth animation="pulse" />
                        <Skeleton variant="text" width="100%" height="" fullWidth animation="pulse" />
                        <Skeleton variant="text" width="100%" height="" fullWidth animation="pulse" />
                    </Box>
                ))}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Skeleton variant="text" width="20%" height="" fullWidth animation="pulse" />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', mt: 1, gap: 2 }}>
                    <Skeleton variant="text" width="100%" height="" fullWidth animation="pulse" />
                    <Skeleton variant="text" width="100%" height="" fullWidth animation="pulse" />
                </Box>
            </>) : (
                <Fade in>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} >
                        <Typography variant="body1" color="initial" sx={{ color: 'primary.main' }}>SPOUSE'S INFORMATION</Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', flexDirection: { xs: 'column', md: 'row' } }}>
                            <TextField
                                id=""
                                label="SURNAME"
                                variant='outlined'
                                name="spouse_surname"
                                value={familyState.spouse_surname}
                                onChange={handleChange}
                            />
                            <TextField
                                id=""
                                label="FIRST NAME"
                                variant='outlined'
                                name="spouse_fname"
                                value={familyState.spouse_fname}
                                onChange={handleChange}
                            />
                            <TextField
                                id=""
                                label="MIDDLE NAME"
                                variant='outlined'
                                name="spouse_mname"
                                value={familyState.spouse_mname}
                                onChange={handleChange}
                            />
                            <TextField
                                id=""
                                label="NAME EXTENSION"
                                variant='outlined'
                                name="spouse_extn"
                                value={familyState.spouse_extn}
                                onChange={handleChange}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', flexDirection: { xs: 'column', md: 'row' } }}>
                            <TextField
                                id=""
                                label="OCCUPATION"
                                variant='outlined'
                                name="occupation"
                                value={familyState.occupation}
                                onChange={handleChange}
                            />
                            <TextField
                                id=""
                                label="EMPLOYEER NAME"
                                variant='outlined'
                                name="employeer_name"
                                value={familyState.employeer_name}
                                onChange={handleChange}
                            />
                            <TextField
                                id=""
                                label="EMPLOYEER ADDRESS"
                                variant='outlined'
                                name="emp_address"
                                value={familyState.emp_address}
                                onChange={handleChange}
                            />
                            <TextField
                                id=""
                                label="TELEPHONE NUMBER"
                                variant='outlined'
                                name="tel_no"
                                value={familyState.tel_no}
                                onChange={handleChange}
                            />
                        </Box>
                        <Typography variant="body1" color="initial" sx={{ color: 'primary.main' }} >FATHER'S INFORMATION</Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', flexDirection: { xs: 'column', md: 'row' } }}>
                            <TextField
                                id=""
                                label="SURNAME"
                                variant='outlined'
                                name="father_surname"
                                value={familyState.father_surname}
                                onChange={handleChange}
                            />
                            <TextField
                                id=""
                                label="FIRSTNAME"
                                variant='outlined'
                                name="father_fname"
                                value={familyState.father_fname}
                                onChange={handleChange}
                            />
                            <TextField
                                id=""
                                label="MIDDLENAME"
                                variant='outlined'
                                name="father_mname"
                                value={familyState.father_mname}
                                onChange={handleChange}
                            />
                            <TextField
                                id=""
                                label="EXTENSION"
                                variant='outlined'
                                name="father_extn"
                                value={familyState.father_extn}
                                onChange={handleChange}
                            />
                        </Box>
                        <Typography variant="body1" color="initial" sx={{ color: 'primary.main' }}>MOTHER'S INFORMATION</Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', flexDirection: { xs: 'column', md: 'row' } }}>
                            <TextField
                                id=""
                                label="MAIDEN NAME"
                                variant='outlined'
                                name="mother_maiden"
                                value={familyState.mother_maiden}
                                onChange={handleChange}
                            />
                            <TextField
                                id=""
                                label="SURNAME"
                                variant='outlined'
                                name="mother_lname"
                                value={familyState.mother_lname}
                                onChange={handleChange}
                            />
                            <TextField
                                id=""
                                label="FIRSTNAME"
                                variant='outlined'
                                name="mother_fname"
                                value={familyState.mother_fname}
                                onChange={handleChange}
                            />
                            <TextField
                                id=""
                                label="MIDDLENAME"
                                variant='outlined'
                                name="mother_mname"
                                value={familyState.mother_mname}
                                onChange={handleChange}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant='contained' disabled={!contextId && !localStorage.getItem('applicant_temp_id') && applicantStatusContext === 3 ? true : false} sx={{ borderRadius: '2rem' }} endIcon={<ArrowForward />} onClick={() => handleSubmit(familyState, contextId)}>Submit</Button>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <Button variant='contained' disabled={!contextId && !localStorage.getItem('applicant_temp_id') && applicantStatusContext === 3 ? true : false} color='success' sx={{ borderRadius: '2rem' }} startIcon={<AddIcon />} onClick={handleOpen}>Add children</Button>
                        </Box>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left"></TableCell>
                                        <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">Full Name of child</TableCell>
                                        <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">Date of Birth</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loaderChild ? (
                                        <>
                                            <TableRow>
                                                <TableCell align="left"><Skeleton variant="text" width="" fullWidth height="" animation="pulse" /></TableCell>
                                                <TableCell align="left"><Skeleton variant="text" width="" fullWidth height="" animation="pulse" /></TableCell>
                                                <TableCell align="left"><Skeleton variant="text" width="" fullWidth height="" animation="pulse" /></TableCell>
                                            </TableRow>
                                        </>
                                    ) : (
                                        <>
                                            {childList && childList.map((item, index) => (
                                                <Fade in>
                                                    <TableRow key={item.id}>
                                                        <TableCell align="left">
                                                            <Box display='flex' gap={1}>
                                                                <PdsBtn type='update' onClick={() => openUpdate(item)} />
                                                                <PdsBtn type='delete' onClick={() => handleDeleteChild(item,childList,setChildList,contextId)} />
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell align="left">{item.child_name}</TableCell>
                                                        <TableCell align="left">{moment(item.dob,"YYYY-MM-DD").format("MM/DD/YYYY") }</TableCell>
                                                    </TableRow>
                                                </Fade>
                                            ))}
                                        </>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Fade>)}

        </Box>
    );
};

export default FamilyBackground;