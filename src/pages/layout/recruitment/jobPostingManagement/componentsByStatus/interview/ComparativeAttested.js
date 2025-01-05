import React, { useState, useContext, useEffect, useRef } from 'react';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'

import axios from 'axios'

const ComparativeAttested = ({ comparativeAttested, setComparativeAttested, handleAttestedChange, comparativeApprove, setComparativeApprove, data }) => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    // panelist 
    const fetchPanel = async (controller) => {
        let res = await axios.post(`/api/recruitment/jobPosting/status/set-interview/fetchPanelist`, { vacancy_id: data }, { signal: controller.signal })
        // after fetching the panelist, store to the panels tab
        setComparativeAttested(prev => res.data?.panel_lists?.sort((a, b) => a.is_chairman < b.is_chairman ? 1 : -1)?.map(item => ({ ...item, name: item?.fname + ' '+ item?.mname + ' ' + item?.lname })))
    }
    useEffect(() => {
        let controller = new AbortController()
        fetchPanel(controller)
        // clean up
        return (() => controller.abort())
    }, [])
    return (
        <div>
            <Typography variant="body1" color="#BEBEBE" textAlign='center' mt={5}>ATTESTED BY SIGNATORIES</Typography>
            <Box display='flex' gap={1} mt={2} sx={{ display: 'flex', flexDirection: matches ? 'column' : 'row', justifyContent: 'space-between' }}>
                {Array.from(Array(5)).map((item, index) => (
                    <Card flex={1}>
                        <CardContent>
                            <Typography variant="body2" color="warning.main" textAlign='LEFT'>Panel {index + 1}</Typography>
                            <Box display="flex" sx={{ flexDirection: 'column', gap: 2, mt: 1 }}>
                                <TextField
                                    id=""
                                    label="Full name"
                                    fullWidth
                                    size='small'
                                    name="name"
                                    value={comparativeAttested[index]?.name}
                                    onChange={(e) => handleAttestedChange(e, index)}
                                />
                                <TextField
                                    id=""
                                    label="Office"
                                    fullWidth
                                    size='small'
                                    name="office"
                                    value={comparativeAttested[index]?.office}
                                    onChange={(e) => handleAttestedChange(e, index)}
                                />
                                <TextField
                                    id=""
                                    label="Designation"
                                    fullWidth
                                    size='small'
                                    name="designation"
                                    value={comparativeAttested[index]?.designation}
                                    onChange={(e) => handleAttestedChange(e, index)}
                                />
                                <TextField
                                    id=""
                                    label="Head"
                                    fullWidth
                                    size='small'
                                    name="head"
                                    value={comparativeAttested[index]?.head}
                                    onChange={(e) => handleAttestedChange(e, index)}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>
            <Box mt={5}>
                <Typography variant="body1" color="#BEBEBE" align='center' gutterBottom>APPROVED BY SIGNATORIES</Typography>
                <Box display="flex" justifyContent='center' mt={2}>
                    <TextField
                        id=""
                        label="Full name"
                        size='small'
                        margin='auto'
                        value={comparativeApprove?.name}
                        onChange={(e) => setComparativeApprove(prev => ({ ...prev, name: e.target.value }))}
                    />
                </Box>

            </Box>
        </div>
    );
};

export default ComparativeAttested;