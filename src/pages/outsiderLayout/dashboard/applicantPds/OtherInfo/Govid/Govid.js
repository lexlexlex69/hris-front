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
import Container from '@mui/material/Container'
import axios from 'axios'

import CustomBackdrop from '../../../qs/CustomBackdrop';

import CustomDialog from '../../../qs/basic_pds/CustomDialog';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';



const Govid = () => {
    const { contextId } = useContext(PdsContext) || '' // temporary contextId

    const [customBackDrop, setCustomBackDrop] = useState(false)
    const [inputData, setInputData] = useState({
        govId: '',
        idNo: '',
        datePlaceIssuance: '',
        contextId: parseInt(localStorage.getItem('applicant_temp_id')) ? parseInt(localStorage.getItem('applicant_temp_id')) : contextId ? contextId : '',
    })

    const getGovId = async () => {
        let controller = new AbortController()
        let res = await axios.get(`/api/recruitment/applicant/pds/govid/getGovid?contextId=${parseInt(localStorage.getItem('applicant_temp_id')) ? parseInt(localStorage.getItem('applicant_temp_id')) : contextId ? contextId : ''}`)
        if (res.data) {
            setInputData({
                govId: res.data.gov_id,
                idNo: res.data.id_no,
                datePlaceIssuance: res.data.date_place_issuance,
                contextId: contextId,
            })
        }
    }

    const handleChange = (e) => {
        setInputData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const submitGovid = async () => {
        Swal.fire({
            text: 'Processing, please wait . . .',
            icon: 'info'
        })
        Swal.showLoading()
        let res = await axios.post(`/api/recruitment/applicant/pds/govid/upsertGovid`, inputData)
        if (res.data.status === 200) {
            toast.success('Updated.', { autoClose: 1000 })
        }
        else if (res.data.status === 500) {
            toast.error(res.data.message, { autoClose: 2000 })
        }
        Swal.close()

    }

    useEffect(() => {
        getGovId()

    }, [])
    return (
        <Box>
            <CustomBackdrop open={customBackDrop} title='processing, please wait . . .' />
            <Typography variant="body1" color="initial" sx={{ p: .5, bgcolor: 'primary.light', color: '#fff', borderRadius: '.2rem', mb: 2 }}>Goverment ID</Typography>
            <Box display='flex' gap={1} flexDirection={{xs:'column',md:'row'}}>
                <TextField
                    id=""
                    label="Goverment ID"
                    name="govId"
                    value={inputData.govId}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    id=""
                    label="ID NUMBER"
                    name="idNo"
                    value={inputData.idNo}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    id=""
                    name="datePlaceIssuance"
                    label="DATE / PLACE OF ISSUANCE"
                    value={inputData.datePlaceIssuance}
                    onChange={handleChange}
                    fullWidth
                />

            </Box>
            <Box mt={1} display='flex' justifyContent='flex-end'>
                <Button variant="contained" sx={{ borderRadius: '2rem' }} startIcon={<ArrowForward />} color="primary" onClick={submitGovid}>
                    Submit
                </Button>
            </Box>
        </Box>
    );
};

export default Govid;