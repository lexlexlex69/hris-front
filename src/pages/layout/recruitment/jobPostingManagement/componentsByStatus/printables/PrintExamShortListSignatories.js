import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ArrowForward from '@mui/icons-material/ArrowForward';
import axios from 'axios'

import CustomBackdrop from '../CustomBackdrop';
import { toast } from 'react-toastify';

const PrintExamShortListSignatories = ({ signatoriesData, setSignatoriesData, setSignatoriesModal, vacancyId }) => {

    const [localStateInput, setLocalStateInput] = useState({
        preparedBy: '',
        preparedByParenthetic: '',
        preparedByPosition: '',
        reviewedBy: '',
        reviewedByParenthetic: '',
        reviewedByPosition: '',
        approvedBy: '',
        approvedByParenthetic: '',
        approvedByPosition: '',
    })

    const [customBackDrop, setCustomBackDrop] = useState(false)

    const handleStoreInput = (e) => {
        setLocalStateInput(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const handleSetSignatories = async () => {
        setCustomBackDrop(true)
        let res = await axios.post(`/api/recruitment/jobPosting/status/examination/set-signatories`, { data: localStateInput, vacancyId: vacancyId })
        if(res.data.status === 200)
        {
            Object.entries(localStateInput).map(x => {
                if (x[1]) {
                    setSignatoriesData(prev => ({ ...prev, [x[0]]: x[1] }))
                }
            })
            setSignatoriesModal(false)
        }
        else if(res.data.status === 500)
        {
            toast.error(res.data.message)
        }
     
        setCustomBackDrop(false)
    }

    // balikan rani na part
    const fetchAssignatories = async () => {
        let res = await axios.get(`/api/recruitment/jobPosting/status/examination/get-signatories?vacancyId=${vacancyId}`)
        setLocalStateInput({
            preparedBy: res.data.prep_name,
            preparedByParenthetic: res.data.prep_pos,
            preparedByPosition: res.data.prep_title,
            reviewedBy: res.data.rev_name,
            reviewedByParenthetic: res.data.rev_pos,
            reviewedByPosition: res.data.rev_title,
            approvedBy: res.data.appr_name,
            approvedByParenthetic: res.data.appr_pos,
            approvedByPosition: res.data.appr_title,
        })
    }

    useEffect(() => {
        fetchAssignatories()
        setLocalStateInput({
            preparedBy: signatoriesData.preparedBy,
            preparedByParenthetic: signatoriesData.preparedByParenthetic,
            preparedByPosition: signatoriesData.preparedByPosition,
            reviewedBy: signatoriesData.reviewedBy,
            reviewedByParenthetic: signatoriesData.reviewedByParenthetic,
            reviewedByPosition: signatoriesData.reviewedByPosition,
            approvedBy: signatoriesData.approvedBy,
            approvedByParenthetic: signatoriesData.approvedByParenthetic,
            approvedByPosition: signatoriesData.approvedByPosition,
        })
    }, [])
    return (
        <>
            <Box display='flex' width='100%' sx={{ flexDirection: { xs: 'column', sm: 'column', md: 'row' } }} gap={2} >
                <CustomBackdrop title='Setting signatories . . .' open={customBackDrop} />
                <Box display="flex" sx={{ flexDirection: { xs: 'column', sm: 'column', md: 'column' } }} gap={2} flex={1}>
                    <Typography variant="body2" color="warning.main">PREPARED BY</Typography>
                    <TextField autoComplete='off' size='small' label='NAME' value={localStateInput.preparedBy} name="preparedBy" fullWidth onChange={handleStoreInput}></TextField>
                    <TextField autoComplete='off' size='small' label='PARENTHETICAL POSITION' value={localStateInput.preparedByParenthetic} fullWidth name="preparedByParenthetic" onChange={handleStoreInput}></TextField>
                    <TextField autoComplete='off' size='small' label='POSITION TITLE' fullWidth value={localStateInput.preparedByPosition} name="preparedByPosition" onChange={handleStoreInput}></TextField>
                </Box>
                <Box display="flex" flexDirection='column' gap={2} flex={1}>
                    <Typography variant="body2" color="warning.main">REVIEWED BY</Typography>
                    <TextField autoComplete='off' size='small' label='NAME' name="reviewedBy" value={localStateInput.reviewedBy} fullWidth onChange={handleStoreInput}></TextField>
                    <TextField autoComplete='off' size='small' label='PARENTHETICAL POSITION' value={localStateInput.reviewedByParenthetic} fullWidth name="reviewedByParenthetic" onChange={handleStoreInput}></TextField>
                    <TextField autoComplete='off' size='small' label='POSITION TITLE' fullWidth value={localStateInput.reviewedByPosition} name="reviewedByPosition" onChange={handleStoreInput}></TextField>
                </Box>
                <Box display="flex" flexDirection='column' gap={2} flex={1}>
                    <Typography variant="body2" color="warning.main">APPROVED BY</Typography>
                    <TextField autoComplete='off' size='small' label='NAME' fullWidth name="approvedBy" value={localStateInput.approvedBy} onChange={handleStoreInput}></TextField>
                    <TextField autoComplete='off' size='small' label='PARENTHETICAL POSITION' fullWidth value={localStateInput.approvedByParenthetic} name="approvedByParenthetic" onChange={handleStoreInput}></TextField>
                    <TextField autoComplete='off' size='small' label='POSITION TITLE' fullWidth value={localStateInput.approvedByPosition} name="approvedByPosition" onChange={handleStoreInput}></TextField>
                </Box>
            </Box>
            <Box mt={2} display='flex' justifyContent='flex-end'>
                <Button variant="contained" startIcon={<ArrowForward />} color="primary" sx={{ borderRadius: '2rem' }} onClick={handleSetSignatories}>
                    Set signatories
                </Button>
            </Box>
        </>
    );
};

export default PrintExamShortListSignatories;