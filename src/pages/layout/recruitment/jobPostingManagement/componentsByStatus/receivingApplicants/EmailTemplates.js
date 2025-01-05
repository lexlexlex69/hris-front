import React, { useCallback, useState } from 'react';
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import axios from 'axios';
import { CardContent, TextField } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import CommonBackdrop from '../../../../../../common/Backdrop';
import CommonModal from '../../../../../../common/Modal';

const EmailTemplates = ({ data, handleCloseModal }) => {
    const [workExpSheet, setWorkExpSheet] = useState(false)
    const [coe, setCoe] = useState(false)
    const [tor, setTor] = useState(false)
    const [commonBD, setCommonBD] = useState(false)
    const [deadlineDate, setDeadlineDate] = useState(false)
    const [openPreview, setOpenPreview] = useState(false)
    const [previewData, setPreviewData] = useState({})

    const handleSendNotifs = async (category) => {
        if (category === 'lacking_docs') {
            // check if deadline date is filled
            if (!deadlineDate) {
                toast.warning('Deadline date is required')
                return
            }
        }
        Swal.fire({
            text: "Send Template via email?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Send'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setCommonBD(true)
                let res = await axios.post(`/api/recruitment/jobPosting/status/receiving-applicants/emailTemplates`, { category: category, data: data, workExpSheet: workExpSheet ? 1 : 0, coe: coe ? 1 : 0, tor: tor ? 1 : 0 })
                console.log(res)
                if (res.data.status === 200) {
                    toast.success('Sent!',{autoClose:800})
                }
                else if (res.data.status === 500) {
                    toast.error(res.data.message)
                }
                setCommonBD(false)
            }
        })

    }

    const handlePreviewNotifs = async (category) => {
        // check if deadline date is filled
        if (!deadlineDate) {
            toast.warning('Deadline date is required')
            return
        }
        Swal.fire({
            text: "Preview?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setCommonBD(true)
                let res = await axios.post(`/api/recruitment/jobPosting/status/receiving-applicants/previewLacking`, { category: category, data: data, workExpSheet: workExpSheet ? 1 : 0, coe: coe ? 1 : 0, tor: tor ? 1 : 0 })
                console.log(res)
                setOpenPreview(true)
                setPreviewData(res.data)
                if (res.data.status === 200) {
                    toast.success('Sent!')
                }
                else if (res.data.status === 500) {
                    toast.error(res.data.message)
                }
                setCommonBD(false)
            }
        })
    }

    return (
        <Box sx={{ height: '85vh', overflowY: 'scroll', px: 1 }}>
            <CommonModal open={openPreview} setOpen={setOpenPreview} customWidth='40%' >
                <Typography variant="body1" color="initial" gutterBottom>
                    Good day,
                </Typography>
                <Typography variant="body1" color="initial" gutterBottom>
                    This is to confirm receipt of the lacking documents that you have sent us. We will contact you of the initial evaluation results of your application upon the start of the screening process. Thank you and have a nice day.
                </Typography>
                <Box display='flex' flexDirection='column' gap={1}>
                    <Typography>{previewData?.educ}</Typography>
                    <Typography>{previewData?.eli}</Typography>
                    <Typography>{previewData?.train}</Typography>
                    {previewData?.workExpSheet && <Typography>Lacking work experience sheet</Typography>}
                    {previewData?.coe && <Typography>Lacking Certificate of employment</Typography>}
                    {previewData?.tor && <Typography>Lacking College TOR</Typography>}
                    <Typography sx={{ mt: 5 }} gutterBottom>Respectfully yours,</Typography>
                    <Typography>The City Human Resource Management Office City Government of Butuan</Typography>

                </Box>
            </CommonModal>
            <CommonBackdrop open={commonBD} title='Processing request, please wait . . .' />
            <Typography variant="body1" color="success.main" fontWeight={700} align='center'>Email templates</Typography>
            <hr />
            <Box display='flex' flexDirection='column' justifyContent='space-around' gap={1}>
                <Button onClick={() => handleSendNotifs('application_complete')} variant='contained' sx={{ fontSize: '12px' }} fullWidth>ACKNOWLEDGING RECEIPT OF COMPLETE APPLICATIONS WITHIN THE DEADLINE</Button>
                <Card raised>
                    <CardContent >
                        <Typography variant='body2' align='center' color="primary" mb={1}>ACKNOWLEDGE W/ REQUEST FOR LACKING DOCUMENTS</Typography>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox checked={workExpSheet} />} onChange={() => setWorkExpSheet(prev => !prev)} label="Lacking work experience sheet" />
                            <FormControlLabel control={<Checkbox checked={coe} />} onChange={() => setCoe(prev => !prev)} label="Lacking Certificate of employment" />
                            <FormControlLabel control={<Checkbox checked={tor} />} onChange={() => setTor(prev => !prev)} label="Lacking College TOR" />
                            <TextField
                                id=""
                                label="deadline date"
                                value={deadlineDate}
                                onChange={(e) => setDeadlineDate(e.target.value)}
                                size='small'
                                type='date'
                                focused
                                sx={{ mb: 1 }}
                            />
                        </FormGroup>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button onClick={() => handlePreviewNotifs('lacking_docs')} variant='contained' sx={{ fontSize: '12px' }} fullWidth>Preview</Button>
                            <Button onClick={() => handleSendNotifs('lacking_docs')} variant='contained' color="success" sx={{ fontSize: '12px' }} fullWidth>Send</Button>
                        </Box>
                    </CardContent>
                </Card>
                <Button onClick={() => handleSendNotifs('lacking_docs')} variant='contained' sx={{ fontSize: '12px' }} fullWidth>ACKNOWLEDGEMENT FOR SUBMISSION OF LACKING DOCS</Button>
                <Button onClick={() => handleSendNotifs('application_late')} variant='contained' sx={{ fontSize: '12px' }}>REPLY FOR LATE SUBMISSIONS (E-MAIL)</Button>
                <Button onClick={() => handleSendNotifs('application_evaluation')} variant='contained' sx={{ fontSize: '12px' }}>NOTICE OF EVALUATION OF APPLICATION</Button>
            </Box>
        </Box>
    );
};

export default EmailTemplates;