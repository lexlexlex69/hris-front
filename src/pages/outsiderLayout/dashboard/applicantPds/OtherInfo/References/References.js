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
import { PdsContext } from '../../MyContext';
import ArrowForward from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import CustomDialog from '../../../qs/basic_pds/CustomDialog';
import Container from '@mui/material/Container'

import { getReference, handleDelete } from './Controller';
import Add from './Add';
import Update from './Update'

import PdsBtn from '../../../PdsBtn';

import { toast } from 'react-toastify'



const References = () => {
    const { contextId, handleContextId, applicantStatusContext } = useContext(PdsContext) || ''
    const [references, setReferences] = useState([])
    const [loader, setLoader] = useState(true)

    const [openAdd, setOpenAdd] = useState(false)
    const handleOpenAdd = () => {
        if (references.length >= 3) {
            toast.warning('Up to three (3) references allowed!', { autoClose: 1000 })
            return
        }
        setOpenAdd(true)
    }
    const closeAdd = () => setOpenAdd(false)

    const [updateData, setUpdateData] = useState('')
    const [openUpdate, setOpenUpdate] = useState(false)
    const handleOpenUpdate = (item) => {
        setUpdateData(item)
        setOpenUpdate(true)
    }
    const closeUpdate = () => setOpenUpdate(false)

    useEffect(() => {
        let controller = new AbortController()
        getReference(setReferences, controller, setLoader, parseInt(localStorage.getItem('applicant_temp_id')) ? parseInt(localStorage.getItem('applicant_temp_id')) : contextId ? contextId : '')
    }, [])
    return (
        <Box>
            <CustomDialog open={openAdd} handleClose={closeAdd}>
                <Add references={references} setReferences={setReferences} setLoader={setLoader} handleClose={closeAdd} />
            </CustomDialog>
            <CustomDialog open={openUpdate} handleClose={closeUpdate}>
                <Update item={updateData} references={references} setReferences={setReferences} setLoader={setLoader} handleClose={closeUpdate} />
            </CustomDialog>
            <Typography variant="body1" color="initial" sx={{ p: .5, bgcolor: 'primary.light', color: '#fff', borderRadius: '.2rem', mb: 2 }}>References</Typography>
            <Box display='flex' justifyContent='flex-end' mb={1}>
                <Button variant='contained' sx={{ borderRadius: '2rem' }} startIcon={<AddIcon />} onClick={handleOpenAdd}>Add</Button>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>REFERENCE NAME</TableCell>
                            <TableCell align="left">REFERENCE ADDRESS</TableCell>
                            <TableCell align="left">REFERENCE TEL. NO.</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loader ? (
                            <>
                                {Array.from(Array(3)).map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell><Skeleton height={30}></Skeleton></TableCell>
                                        <TableCell><Skeleton height={30}></Skeleton></TableCell>
                                        <TableCell><Skeleton height={30}></Skeleton></TableCell>
                                        <TableCell><Skeleton height={30}></Skeleton></TableCell>
                                    </TableRow>
                                ))}
                            </>
                        ) : (
                            <>
                                {references && references.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Box display='flex' gap={1}>
                                                <PdsBtn type='update' onClick={() => handleOpenUpdate(item)} />
                                                <PdsBtn type='delete' onClick={() => handleDelete(item, references, setReferences, setLoader)} />
                                            </Box>
                                        </TableCell>
                                        <TableCell>{item.RefName}</TableCell>
                                        <TableCell>{item.RefAddress}</TableCell>
                                        <TableCell>{item.RefTel}</TableCell>
                                    </TableRow>
                                ))}
                            </>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>

    );
};

export default References;