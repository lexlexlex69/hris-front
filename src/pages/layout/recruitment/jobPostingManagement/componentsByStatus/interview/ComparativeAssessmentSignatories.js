import React, { useState, useContext, useEffect, useRef } from 'react';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import SaveAltIcon from '@mui/icons-material/SaveAlt';

import axios from 'axios'

const ComparativeAssessmentSignatories = ({ comparativePrepared, setComparativePrepared, comparativeCertified, setComparativeCertified, data, handleSetSignatories }) => {
    const fetchSignatories = async () => {
        let res = await axios.get(`/api/recruitment/jobPosting/status/interview-result/get-signatories?vacancyId=${data}`)
        console.log(res)
        setComparativePrepared({
            name: res.data?.prep_name,
            office: res.data?.prep_office,
            designation: res.data?.prep_desig,
            head: res.data?.prep_head
        })
        setComparativeCertified({
            name: res.data?.cert_name,
            office: res.data?.cert_office,
            designation: res.data?.cert_desig,
            head: res.data?.cert_head
        })
    }
    useEffect(() => {
        fetchSignatories()
    }, [])
    return (
        <div>
            <Box>
                <Typography variant="body1" color="#BEBEBE" textAlign='center' mt={2}>COMPARATIVE ASSESSMENT SIGNATORIES</Typography>
            </Box>
            <Box display='flex' sx={{ width: '100%', gap: 2, mt: 2, px: 5 }}>
                <Box flex={1}>
                    <Typography variant="body1" sx={{ color: 'warning.main' }} gutterBottom>Prepared by</Typography>
                    <Box display="flex" sx={{ flexDirection: 'column', gap: 2 }}>
                        <TextField
                            id=""
                            label="Name"
                            fullWidth
                            size='small'
                            value={comparativePrepared.name}
                            onChange={(e) => setComparativePrepared(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <TextField
                            id=""
                            label="Office"
                            fullWidth
                            size='small'
                            value={comparativePrepared.office}
                            onChange={(e) => setComparativePrepared(prev => ({ ...prev, office: e.target.value }))}
                        />
                        <TextField
                            id=""
                            label="Designation"
                            fullWidth
                            size='small'
                            value={comparativePrepared.designation}
                            onChange={(e) => setComparativePrepared(prev => ({ ...prev, designation: e.target.value }))}
                        />
                        <TextField
                            id=""
                            label="Head"
                            fullWidth
                            size='small'
                            value={comparativePrepared.head}
                            onChange={(e) => setComparativePrepared(prev => ({ ...prev, head: e.target.value }))}
                        />
                    </Box>
                </Box>
                <Box flex={1}>
                    <Typography variant="body1" sx={{ color: 'warning.main' }} gutterBottom>Certified by</Typography>
                    <Box display="flex" sx={{ flexDirection: 'column', gap: 2 }}>
                        <TextField
                            id=""
                            label="Name"
                            fullWidth
                            size='small'
                            value={comparativeCertified.name}
                            onChange={(e) => setComparativeCertified(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <TextField
                            id=""
                            label="Office"
                            fullWidth
                            size='small'
                            value={comparativeCertified.office}
                            onChange={(e) => setComparativeCertified(prev => ({ ...prev, office: e.target.value }))}
                        />
                        <TextField
                            id=""
                            label="Designation"
                            fullWidth
                            size='small'
                            value={comparativeCertified.designation}
                            onChange={(e) => setComparativeCertified(prev => ({ ...prev, designation: e.target.value }))}
                        />
                        <TextField
                            id=""
                            label="Head"
                            fullWidth
                            size='small'
                            value={comparativeCertified.head}
                            onChange={(e) => setComparativeCertified(prev => ({ ...prev, head: e.target.value }))}
                        />
                    </Box>
                </Box>
            </Box>
            <Box display='flex' sx={{ px: 5, justifyContent: 'flex-start', pt: 3 }}>
                <Button variant="contained" color="warning" sx={{ borderRadius: '2rem' }} startIcon={<SaveAltIcon />} onClick={() => handleSetSignatories()}>
                    set Signatories
                </Button>
            </Box>
        </div>
    );
};

export default ComparativeAssessmentSignatories;